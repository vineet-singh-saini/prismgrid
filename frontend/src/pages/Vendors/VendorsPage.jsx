import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../lib/permissions";
import { createVendor, listVendors, updateVendor } from "../../lib/workspaceApi";
import "../../styles/pages.css";

const initialVendorForm = {
  name: "",
  reliability: 80,
  delayedDeliveries: 0,
  complianceIssues: 0,
  costDeviation: "Low",
  riskLevel: "low",
  status: "Stable",
  note: "",
};

function VendorsPage() {
  const { hasPermission } = useAuth();
  const canWriteVendors = hasPermission(PERMISSIONS.VENDORS_WRITE);
  const [vendors, setVendors] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    message: "",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState(initialVendorForm);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [editingValues, setEditingValues] = useState(initialVendorForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadVendors() {
      setStatus((currentStatus) => ({ ...currentStatus, loading: true, error: "" }));

      try {
        const nextVendors = await listVendors();

        if (!isActive) {
          return;
        }

        setVendors(nextVendors);
        setStatus((currentStatus) => ({
          ...currentStatus,
          loading: false,
          error: "",
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setStatus((currentStatus) => ({
          ...currentStatus,
          loading: false,
          error: error.message,
        }));
      }
    }

    loadVendors();

    return () => {
      isActive = false;
    };
  }, []);

  const meta = useMemo(
    () => [
      `${vendors.length} strategic vendors`,
      `${vendors.filter((vendor) => vendor.riskLevel === "high").length} on watchlist`,
      canWriteVendors ? "Live supplier management" : "Read-only supplier view",
    ],
    [canWriteVendors, vendors]
  );

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleCreateVendor = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await createVendor({
        ...formValues,
        reliability: Number(formValues.reliability),
        delayedDeliveries: Number(formValues.delayedDeliveries),
        complianceIssues: Number(formValues.complianceIssues),
      });
      const nextVendors = await listVendors();
      setVendors(nextVendors);
      setFormValues(initialVendorForm);
      setFormOpen(false);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Vendor created successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditingVendor = (vendor) => {
    setEditingVendorId(vendor.id);
    setEditingValues({
      name: vendor.name,
      reliability: vendor.reliability,
      delayedDeliveries: vendor.delayedDeliveries,
      complianceIssues: vendor.complianceIssues,
      costDeviation: vendor.costDeviation,
      riskLevel: vendor.riskLevel,
      status: vendor.status,
      note: vendor.note,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSaveVendor = async () => {
    setStatus((currentStatus) => ({ ...currentStatus, error: "", message: "" }));

    try {
      await updateVendor(editingVendorId, {
        ...editingValues,
        reliability: Number(editingValues.reliability),
        delayedDeliveries: Number(editingValues.delayedDeliveries),
        complianceIssues: Number(editingValues.complianceIssues),
      });
      const nextVendors = await listVendors();
      setVendors(nextVendors);
      setEditingVendorId(null);
      setStatus((currentStatus) => ({
        ...currentStatus,
        message: "Vendor updated successfully.",
      }));
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message,
      }));
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Supplier Intelligence"
        title="Vendor Ops"
        subtitle="Track reliability, compliance posture, and schedule impact across the vendors that shape portfolio confidence."
        meta={meta}
        action={
          canWriteVendors ? (
            <button className="primary-btn" type="button" onClick={() => setFormOpen((value) => !value)}>
              {formOpen ? "Close vendor form" : "Add vendor"}
            </button>
          ) : null
        }
      />

      {formOpen ? (
        <section className="info-card form-shell">
          <div className="info-card-head">
            <h3>Add vendor</h3>
            <span className="eyebrow">Reliability, compliance, and watchlist posture</span>
          </div>

          <form className="form-grid" onSubmit={handleCreateVendor}>
            <div className="form-grid-two">
              <input
                required
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleCreateChange}
                placeholder="Vendor name"
              />
              <select name="status" value={formValues.status} onChange={handleCreateChange}>
                <option>Preferred</option>
                <option>Stable</option>
                <option>Monitored</option>
                <option>Watchlist</option>
              </select>
              <select name="riskLevel" value={formValues.riskLevel} onChange={handleCreateChange}>
                <option value="low">Low risk</option>
                <option value="medium">Medium risk</option>
                <option value="high">High risk</option>
              </select>
              <select
                name="costDeviation"
                value={formValues.costDeviation}
                onChange={handleCreateChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                required
                min="0"
                max="100"
                name="reliability"
                type="number"
                value={formValues.reliability}
                onChange={handleCreateChange}
                placeholder="Reliability"
              />
              <input
                required
                min="0"
                name="delayedDeliveries"
                type="number"
                value={formValues.delayedDeliveries}
                onChange={handleCreateChange}
                placeholder="Delayed deliveries"
              />
              <input
                required
                min="0"
                name="complianceIssues"
                type="number"
                value={formValues.complianceIssues}
                onChange={handleCreateChange}
                placeholder="Compliance issues"
              />
            </div>

            <textarea
              required
              name="note"
              value={formValues.note}
              onChange={handleCreateChange}
              placeholder="Supplier note"
              rows="4"
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving vendor..." : "Create vendor"}
              </button>
              <button className="secondary-btn" type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {status.message ? <p className="settings-status">{status.message}</p> : null}
      {status.error ? <p className="settings-status form-error">{status.error}</p> : null}

      {status.loading ? (
        <section className="info-card page-state compact">
          <h3>Loading vendor intelligence</h3>
          <p>Pulling supplier reliability, compliance posture, and watchlist state.</p>
        </section>
      ) : null}

      <section className="project-card-grid vendors-grid">
        {vendors.map((vendor) => (
          <article className="project-card vendor-card" key={vendor.id}>
            <div className="project-card-top">
              <div>
                <span className="eyebrow">{vendor.status}</span>
                <h3>{vendor.name}</h3>
                <p>{vendor.note}</p>
              </div>
              <span className={`status-chip ${vendor.riskLevel}`}>{vendor.riskLevel}</span>
            </div>

            <div className="project-card-metrics">
              <div>
                <span>Reliability</span>
                <strong>{vendor.reliability}</strong>
              </div>
              <div>
                <span>Delayed deliveries</span>
                <strong>{vendor.delayedDeliveries}</strong>
              </div>
              <div>
                <span>Compliance issues</span>
                <strong>{vendor.complianceIssues}</strong>
              </div>
              <div>
                <span>Cost deviation</span>
                <strong>{vendor.costDeviation}</strong>
              </div>
            </div>

            {canWriteVendors ? (
              <div className="form-actions">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() =>
                    editingVendorId === vendor.id
                      ? setEditingVendorId(null)
                      : startEditingVendor(vendor)
                  }
                >
                  {editingVendorId === vendor.id ? "Close editor" : "Edit vendor"}
                </button>
              </div>
            ) : null}

            {editingVendorId === vendor.id ? (
              <div className="inline-edit-stack">
                <div className="form-grid-two compact">
                  <input
                    name="name"
                    type="text"
                    value={editingValues.name}
                    onChange={handleEditChange}
                    placeholder="Vendor name"
                  />
                  <input
                    min="0"
                    max="100"
                    name="reliability"
                    type="number"
                    value={editingValues.reliability}
                    onChange={handleEditChange}
                    placeholder="Reliability"
                  />
                  <input
                    min="0"
                    name="delayedDeliveries"
                    type="number"
                    value={editingValues.delayedDeliveries}
                    onChange={handleEditChange}
                    placeholder="Delayed deliveries"
                  />
                  <input
                    min="0"
                    name="complianceIssues"
                    type="number"
                    value={editingValues.complianceIssues}
                    onChange={handleEditChange}
                    placeholder="Compliance issues"
                  />
                  <select name="status" value={editingValues.status} onChange={handleEditChange}>
                    <option>Preferred</option>
                    <option>Stable</option>
                    <option>Monitored</option>
                    <option>Watchlist</option>
                  </select>
                  <select
                    name="riskLevel"
                    value={editingValues.riskLevel}
                    onChange={handleEditChange}
                  >
                    <option value="low">Low risk</option>
                    <option value="medium">Medium risk</option>
                    <option value="high">High risk</option>
                  </select>
                  <select
                    name="costDeviation"
                    value={editingValues.costDeviation}
                    onChange={handleEditChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <textarea
                  name="note"
                  value={editingValues.note}
                  onChange={handleEditChange}
                  placeholder="Supplier note"
                  rows="3"
                />
                <div className="form-actions">
                  <button className="primary-btn" type="button" onClick={handleSaveVendor}>
                    Save vendor
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="table-card">
        <div className="card-head">
          <h3>Vendor watch matrix</h3>
          <p>Fast scan of supplier health and where intervention may be required.</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Status</th>
                <th>Reliability</th>
                <th>Delayed deliveries</th>
                <th>Compliance issues</th>
                <th>Cost deviation</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td data-label="Vendor">{vendor.name}</td>
                  <td data-label="Status">
                    <span className={`status-chip ${vendor.riskLevel}`}>{vendor.status}</span>
                  </td>
                  <td data-label="Reliability">{vendor.reliability}</td>
                  <td data-label="Delayed deliveries">{vendor.delayedDeliveries}</td>
                  <td data-label="Compliance issues">{vendor.complianceIssues}</td>
                  <td data-label="Cost deviation">{vendor.costDeviation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default VendorsPage;
