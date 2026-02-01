import { useState, useEffect } from "react";
import "./viewstatus.css";
import UserSidebar from './UserSidebar';

function ViewStatus() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      const body = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(body.complaints)) {
        const mapped = body.complaints.map((c) => ({
          id: c.id,
          registrationNumber: c.id ? `CMP-${c.id}` : '',
          receivedDate: c.created_at || c.createdAt || new Date().toISOString(),
          description: c.description || '',
          status: c.status || 'REGISTERED',
        }));
        setComplaints(mapped);
        setCurrentPage(1);
      } else {
        console.warn('Unexpected complaints response', body);
        setComplaints([]);
      }
    } catch (e) {
      console.error('Failed to load complaints', e);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // listen for local updates (ComplaintForm persists to localStorage and triggers event)
    const handler = () => fetchComplaints();
    window.addEventListener('mycomplaints:updated', handler);
    return () => window.removeEventListener('mycomplaints:updated', handler);
  }, []);

  // Filter complaints based on search
  const filteredComplaints = complaints.filter(complaint =>
    complaint.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const displayedComplaints = filteredComplaints.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="status-wrapper">
      <UserSidebar />
      <div className="view-status-container">
        <h2>List of Grievances</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="refresh-btn" onClick={fetchComplaints} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          {loading && <span style={{ fontSize: 12, color: '#666' }}>Loading...</span>}
        </div>

      <div className="status-controls">
        <div className="entries-selector">
          <select 
            value={entriesPerPage} 
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
          <span>entries</span>
        </div>

        <div className="search-box">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by Registration Number or Description"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="grievances-table">
          <thead>
            <tr>
              <th className="col-sn">Sn.</th>
              <th className="col-reg">Registration Number</th>
              <th className="col-date">Registered Date</th>
              <th className="col-desc">Grievance description</th>
              <th className="col-status">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedComplaints.length > 0 ? (
              displayedComplaints.map((complaint, index) => (
                <tr key={complaint.id || index}>
                  <td className="col-sn">{startIndex + index + 1}</td>
                  <td className="col-reg">{complaint.registrationNumber}</td>
                  <td className="col-date">{new Date(complaint.receivedDate).toLocaleDateString()}</td>
                  <td className="col-desc">{complaint.description}</td>
                  <td className="col-status">
                    <span className={`status-badge status-${complaint.status?.toLowerCase()}`}>
                      {complaint.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="entries-info">
          {displayedComplaints.length > 0 ? (
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredComplaints.length)} of{" "}
              {filteredComplaints.length} entries
            </span>
          ) : (
            <span>No entries found</span>
          )}
        </div>

        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={handleFirst}
            disabled={currentPage === 1 || totalPages === 0}
          >
            First
          </button>
          <button 
            className="pagination-btn" 
            onClick={handlePrevious}
            disabled={currentPage === 1 || totalPages === 0}
          >
            Prev
          </button>
          <button 
            className="pagination-btn" 
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
          <button 
            className="pagination-btn" 
            onClick={handleLast}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Last
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default ViewStatus;
