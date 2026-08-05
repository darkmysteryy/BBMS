// pages/Inventory.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "../redux/slices/inventorySlice";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import useAuth from "../hooks/useAuth";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Inventory = () => {
  const dispatch = useDispatch();
  const { items, lowStockCount, loading } = useSelector((state) => state.inventory);
  const { isAdmin } = useAuth(); // only admins can add/edit/delete

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({ bloodGroup: "", units: 0, status: "available" });
  
  const [confirm, setConfirm]     = useState({ open: false, id: null });

  useEffect(() => { dispatch(fetchInventory()); }, [dispatch]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setForm({ bloodGroup: item.bloodGroup, units: item.units, status: item.status });
    } else {
      setEditingId(null);
      setForm({ bloodGroup: "", units: 1, status: "available" });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateInventoryItem({ id: editingId, data: form }));
    } else {
      await dispatch(addInventoryItem(form));
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteInventoryItem(confirm.id));
    setConfirm({ open: false, id: null });
  };

  const statusBadge = (status) => {
    const map = { available: "badge-success", used: "badge-muted", expired: "badge-danger" };
    return <span className={`badge ${map[status] || "badge-muted"}`}>{status}</span>;
  };

  if (loading && items.length === 0) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="page-title">Blood Inventory</h1>
          <p className="page-subtitle">Current stock levels across all blood groups</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            ➕ Add Stock
          </button>
        )}
      </div>

      {lowStockCount > 0 && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "24px", color: "var(--color-danger)" }}>
          🚨 <strong>Warning:</strong> {lowStockCount} inventory record(s) show stock below 10 units.
        </div>
      )}

      <div className="section-card">
        {items.length === 0 ? (
          <EmptyState icon="🩸" title="Inventory is empty" message="No blood stock available." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Collection Date</th>
                  <th>Expiry Date</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td><span className="badge badge-primary" style={{ fontSize: "1rem" }}>{item.bloodGroup}</span></td>
                    <td style={{ fontWeight: 600, color: item.units < 10 ? "var(--color-danger)" : "inherit" }}>
                      {item.units} units
                    </td>
                    <td>{statusBadge(item.status)}</td>
                    <td>{item.collectionDate ? new Date(item.collectionDate).toLocaleDateString() : "—"}</td>
                    <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</td>
                    {isAdmin && (
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-outline" onClick={() => handleOpenModal(item)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ open: true, id: item._id })}>Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal (Admin Only) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Stock" : "Add Stock manually"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select className="form-select" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} required disabled={editingId}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Units</label>
            <input type="number" className="form-input" value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} min="0" required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="available">Available</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <button type="submit" className="form-submit">{editingId ? "Update Stock" : "Add Stock"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirm.open}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this inventory record? This cannot be undone."
        confirmText="Delete"
        danger
      />
    </DashboardLayout>
  );
};

export default Inventory;
