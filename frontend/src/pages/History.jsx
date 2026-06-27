import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Calendar, ChevronRight, ChevronLeft, Activity, ArrowRight } from "lucide-react";
import api from "../api";

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Aap ise apne hisaab se change kar sakte hain (e.g., 6 ya 12)

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/resume/history");
      setReports(res.data.data || []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to load history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Score badge color based on ATS Score
  const getScoreColor = (score) => {
    const num = Number(score);
    if (num >= 80) return { bg: "#dcfce7", text: "#166534", label: "Excellent" };
    if (num >= 50) return { bg: "#fef08a", text: "#854d0e", label: "Average" };
    return { bg: "#fee2e2", text: "#991b1b", label: "Needs Work" };
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top on page change
  };

  return (
    <div className="history-page">
      <style>
        {`
          .history-page {
            min-height: 100vh;
            padding: 3rem 1.5rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          
          .history-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .history-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .history-header h1 {
            font-size: 2.5rem;
            color: #0f172a;
            font-weight: 900;
            margin-bottom: 0.5rem;
          }
          
          .history-header p {
            color: #64748b;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
          }

          /* Grid Layout */
          .history-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }

          /* Card Design */
          .history-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 1.5rem;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
          }

          .history-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-color: #3b82f6;
          }

          .card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 10px;
          }

          .file-info {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .file-icon {
            background: #e0e7ff;
            color: #4f46e5;
            padding: 10px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .file-info h3 {
            margin: 0;
            font-size: 1.1rem;
            color: #1e293b;
            font-weight: 700;
            line-height: 1.3;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .score-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 1.25rem;
            min-width: 60px;
          }
          
          .score-badge span {
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
            opacity: 0.8;
          }

          .card-details {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: auto;
            padding-top: 1rem;
            border-top: 1px dashed #cbd5e1;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #64748b;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .card-action {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #3b82f6;
            font-weight: 600;
            font-size: 0.95rem;
            margin-top: 5px;
          }

          .history-card:hover .card-action {
            color: #2563eb;
          }

          /* Pagination Styles */
          .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 3rem;
            flex-wrap: wrap;
          }

          .page-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 0.6rem 1.2rem;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-weight: 600;
            color: #334155;
            cursor: pointer;
            transition: all 0.2s;
          }

          .page-btn:hover:not(:disabled) {
            background: #f8fafc;
            border-color: #94a3b8;
            color: #0f172a;
          }

          .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f1f5f9;
          }

          .page-numbers {
            display: flex;
            gap: 5px;
          }

          .num-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-weight: 600;
            color: #334155;
            cursor: pointer;
            transition: all 0.2s;
          }

          .num-btn:hover:not(.active) {
            background: #f8fafc;
          }

          .num-btn.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
          }

          /* States: Loading & Empty */
          .state-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 24px;
            border: 1px dashed #cbd5e1;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1.5rem;
          }

          .empty-icon {
            background: #e0e7ff;
            color: #4f46e5;
            padding: 20px;
            border-radius: 50%;
            margin-bottom: 1rem;
          }

          .primary-btn {
            margin-top: 1.5rem;
            padding: 0.8rem 1.5rem;
            background: #0f172a;
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .primary-btn:hover {
            background: #1e293b;
            transform: scale(1.02);
          }

          @keyframes spin { 100% { transform: rotate(360deg); } }

          @media (max-width: 600px) {
            .history-header h1 { font-size: 2rem; }
            .history-grid { grid-template-columns: 1fr; }
            .page-numbers { display: none; } /* Hide numbers on small mobile, keep Prev/Next */
          }
        `}
      </style>

      <div className="history-container">
        <div className="history-header">
          <h1>My Reports</h1>
          <p>Review your past resume analyses and track your ATS score improvements over time.</p>
        </div>

        {loading ? (
          <div className="state-container">
            <div className="spinner" />
            <h2>Loading History...</h2>
            <p style={{ color: "#64748b" }}>Fetching your past reports securely.</p>
          </div>
        ) : error ? (
          <div className="state-container">
            <h2 style={{ color: "#ef4444" }}>Oops!</h2>
            <p>{error}</p>
            <button className="primary-btn" onClick={fetchReports}>Try Again</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="state-container">
            <div className="empty-icon">
              <FileText size={48} />
            </div>
            <h2>No reports found</h2>
            <p style={{ color: "#64748b", maxWidth: "400px", margin: "10px auto" }}>
              You haven't analyzed any resumes yet. Upload your first resume to get a detailed ATS report.
            </p>
            <Link to="/analyze" className="primary-btn">
              Analyze Resume <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="history-grid">
              {currentReports.map((item) => {
                const scoreData = getScoreColor(item.atsScore || 0);

                return (
                  <Link
                    key={item._id}
                    to={`/report/${item._id}`}
                    className="history-card"
                  >
                    <div className="card-top">
                      <div className="file-info">
                        <div className="file-icon">
                          <FileText size={24} />
                        </div>
                        <h3>{item.fileName || "Resume Document"}</h3>
                      </div>

                      <div 
                        className="score-badge" 
                        style={{ background: scoreData.bg, color: scoreData.text }}
                      >
                        {item.atsScore || "0"}
                        <span>ATS</span>
                      </div>
                    </div>

                    <div className="card-details">
                      <div className="detail-item">
                        <Activity size={16} />
                        <span style={{ textTransform: "capitalize" }}>
                          {item.overallLevel || "Level Unspecified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="card-action">
                      <span>View Full Report</span>
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={18} /> Prev
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`num-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages} 
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}