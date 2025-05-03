  // import React, { useState, useEffect } from 'react';
  // import { useNavigate } from 'react-router-dom';
  // import axios from 'axios';
  // import io from 'socket.io-client';
  // import '../styles/admin.css';

  // const Admin = () => {
  //   const [activeSection, setActiveSection] = useState('register');
  //   const [children, setChildren] = useState([]);
  //   const [selectedChild, setSelectedChild] = useState(null);
  //   const [emotionTrends, setEmotionTrends] = useState([]);
  //   const [gameReports, setGameReports] = useState([]);
  //   const [searchQuery, setSearchQuery] = useState('');
  //   const [registerChild, setRegisterChild] = useState({
  //     childName: '',
  //     phone: '',
  //     userId: '',
  //   });
  //   const [editChild, setEditChild] = useState(null);
  //   const [message, setMessage] = useState('');
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [isFetchingReports, setIsFetchingReports] = useState(false);
  //   const navigate = useNavigate();
  //   const socket = io('http://localhost:3000', { transports: ['websocket'], reconnectionAttempts: 5 });

  //   useEffect(() => {
  //     const token = localStorage.getItem('admin_token');
  //     if (!token) {
  //       console.log('No admin_token, redirecting to /admin-login');
  //       navigate('/admin-login');
  //       return;
  //     }

  //     fetchChildren(token);

  //     socket.on('connect', () => console.log('Socket.IO connected'));
  //     socket.on('connect_error', (err) => console.error('Socket.IO connection error:', err.message));
  //     socket.on('emotionUpdate', ({ parentId, userId, emotion, question, timestamp }) => {
  //       if (parentId === localStorage.getItem('admin_id') && userId === selectedChild) {
  //         setEmotionTrends(prev => [...prev, { emotion, question, timestamp }]);
  //       }
  //     });
  //     socket.on('gameReportUpdate', ({ parentId, userId, score, emotions, question, isCorrect, completedAt }) => {
  //       if (parentId === localStorage.getItem('admin_id') && userId === selectedChild) {
  //         setGameReports(prev => [...prev, { score, emotions, question, isCorrect, completedAt }]);
  //       }
  //     });
  //     socket.on('newChild', ({ parentId, child }) => {
  //       if (parentId === localStorage.getItem('admin_id')) {
  //         setChildren(prev => [child, ...prev]);
  //       }
  //     });
  //     socket.on('childUpdated', ({ parentId, child }) => {
  //       if (parentId === localStorage.getItem('admin_id')) {
  //         setChildren(prev => prev.map(c => (c._id === child._id ? child : c)));
  //       }
  //     });
  //     socket.on('childDeleted', ({ parentId, childId }) => {
  //       if (parentId === localStorage.getItem('admin_id')) {
  //         setChildren(prev => prev.filter(c => c._id !== childId));
  //       }
  //     });
  //     socket.on('childStatusUpdated', ({ parentId, child }) => {
  //       if (parentId === localStorage.getItem('admin_id')) {
  //         setChildren(prev => prev.map(c => (c._id === child._id ? child : c)));
  //       }
  //     });

  //     return () => socket.disconnect();
  //   }, [navigate, selectedChild]);

  //   const fetchChildren = async (token) => {
  //     try {
  //       const res = await axios.get('http://localhost:3000/admin/children', {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log('Fetched children:', res.data);
  //       setChildren(res.data);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching children:', error.response?.data || error.message);
  //       setMessage('Error fetching children');
  //       setIsLoading(false);
  //     }
  //   };

  //   const handleChildSelect = async (userId) => {
  //     setSelectedChild(userId);
  //     console.log('Selected child userId:', userId);
  //     setIsFetchingReports(true);
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.get(`http://localhost:3000/child/emotion-trends/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log('Emotion trends response:', res.data);
  //       setEmotionTrends(res.data || []);
  //     } catch (error) {
  //       console.error('Error fetching emotion trends:', error.response?.data || error.message);
  //       setMessage('Error fetching emotion trends');
  //       setEmotionTrends([]);
  //     }
  //     await fetchGameReport(userId);
  //     setIsFetchingReports(false);
  //     if (activeSection === 'seeReports') {
  //       setActiveSection('seeReports');
  //     }
  //   };

  //   const fetchGameReport = async (userId) => {
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.get(`http://localhost:3000/child/game-reports/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       console.log('Game reports response:', res.data);
  //       setGameReports(res.data || []);
  //     } catch (error) {
  //       console.error('Error fetching game reports:', error.response?.data || error.message);
  //       setMessage('Error fetching game reports');
  //       setGameReports([]);
  //     }
  //   };

  //   const handleSearch = () => {
  //     const child = children.find(c => c.childName.toLowerCase().includes(searchQuery.toLowerCase()));
  //     if (child) {
  //       console.log('Search found child:', child);
  //       handleChildSelect(child.userId);
  //     } else {
  //       setMessage('Child not found');
  //     }
  //   };

  //   const handleRegisterChild = async (e) => {
  //     e.preventDefault();
  //     const token = localStorage.getItem('admin_token');
  //     if (!token) {
  //       navigate('/admin-login');
  //       return;
  //     }
  //     if (!/^\d{6}$/.test(registerChild.userId)) {
  //       setMessage('User ID must be a 6-digit number');
  //       return;
  //     }
  //     try {
  //       const res = await axios.post('http://localhost:3000/admin/register-child', {
  //         ...registerChild,
  //         password: registerChild.userId,
  //       }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(res.data.message);
  //       setRegisterChild({ childName: '', phone: '', userId: '' });
  //       fetchChildren(token);
  //     } catch (error) {
  //       console.error('Error registering child:', error.response?.data || error.message);
  //       setMessage(error.response?.data?.message || 'Registration failed');
  //     }
  //   };

  //   const handleUpdateChild = async () => {
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.put(`http://localhost:3000/admin/children/${editChild._id}/edit`, {
  //         childName: editChild.childName,
  //         phone: editChild.phone,
  //         userId: editChild.userId,
  //       }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(res.data.message);
  //       setEditChild(null);
  //       fetchChildren(token);
  //       setActiveSection('listOfChildren');
  //     } catch (error) {
  //       console.error('Error updating child:', error.response?.data || error.message);
  //       setMessage(error.response?.data?.message || 'Update failed');
  //     }
  //   };

  //   const handleResetPassword = async (childId) => {
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.post(`http://localhost:3000/admin/children/${childId}/reset-password`, {}, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(`Password reset. Temporary password: ${res.data.temporaryPassword}`);
  //     } catch (error) {
  //       console.error('Error resetting password:', error.response?.data || error.message);
  //       setMessage(error.response?.data?.message || 'Reset failed');
  //     }
  //   };

  //   const handleToggleStatus = async (childId, isActive) => {
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.patch(`http://localhost:3000/admin/children/${childId}/status`, { isActive: !isActive }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(res.data.message);
  //       fetchChildren(token);
  //     } catch (error) {
  //       console.error('Error updating status:', error.response?.data || error.message);
  //       setMessage(error.response?.data?.message || 'Status update failed');
  //     }
  //   };

  //   const handleDeleteChild = async (childId) => {
  //     const token = localStorage.getItem('admin_token');
  //     try {
  //       const res = await axios.delete(`http://localhost:3000/admin/children/${childId}/delete`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(res.data.message);
  //       fetchChildren(token);
  //     } catch (error) {
  //       console.error('Error deleting child:', error.response?.data || error.message);
  //       setMessage(error.response?.data?.message || 'Deletion failed');
  //     }
  //   };

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   console.log('Rendering with activeSection:', activeSection, 'selectedChild:', selectedChild, 'editChild:', editChild);

  //   return (
  //     <div className="admin-container">
  //       <nav className="admin-nav">
  //         <button onClick={() => setActiveSection('register')}>Register</button>
  //         <button onClick={() => setActiveSection('listOfChildren')}>List of Children</button>
  //         <button onClick={() => setActiveSection('update')}>Update</button>
  //         <button onClick={() => setActiveSection('delete')}>Delete</button>
  //         <button onClick={() => setActiveSection('seeReports')}>See Reports</button>
  //       </nav>
  //       <h1>Admin Panel</h1>
  //       {message && <p className="message">{message}</p>}

  //       <div className="admin-content">
  //         {activeSection === 'register' && (
  //           <div className="child-registration">
  //             <h2>Register New Child</h2>
  //             <form onSubmit={handleRegisterChild}>
  //               <input
  //                 type="text"
  //                 placeholder="Child Name"
  //                 value={registerChild.childName}
  //                 onChange={e => setRegisterChild({ ...registerChild, childName: e.target.value })}
  //                 required
  //               />
  //               <input
  //                 type="text"
  //                 placeholder="Phone Number"
  //                 value={registerChild.phone}
  //                 onChange={e => setRegisterChild({ ...registerChild, phone: e.target.value })}
  //                 required
  //               />
  //               <input
  //                 type="text"
  //                 placeholder="6-Digit User ID"
  //                 value={registerChild.userId}
  //                 onChange={e => setRegisterChild({ ...registerChild, userId: e.target.value })}
  //                 required
  //               />
  //               <button type="submit">Register Child</button>
  //             </form>
  //           </div>
  //         )}

  //         {activeSection === 'listOfChildren' && (
  //           <div className="child-list">
  //             <h2>Registered Children</h2>
  //             {children.length > 0 ? (
  //               <table>
  //                 <thead>
  //                   <tr>
  //                     <th>Name</th>
  //                     <th>Phone</th>
  //                     <th>User ID</th>
  //                     <th>Status</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {children.map(child => (
  //                     <tr key={child._id}>
  //                       <td>{child.childName}</td>
  //                       <td>{child.phone}</td>
  //                       <td>{child.userId}</td>
  //                       <td>{child.isActive ? 'Active' : 'Inactive'}</td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             ) : (
  //               <p>No children registered yet.</p>
  //             )}
  //           </div>
  //         )}

  //         {activeSection === 'update' && (
  //           <div className="edit-child">
  //             <h2>Update Child</h2>
  //             <div className="child-selector">
  //               <select
  //                 value={editChild ? editChild._id : ''}
  //                 onChange={e => {
  //                   const child = children.find(c => c._id === e.target.value);
  //                   setEditChild(child || null);
  //                 }}
  //               >
  //                 <option value="">Select a child</option>
  //                 {children.map(child => (
  //                   <option key={child._id} value={child._id}>
  //                     {child.childName} ({child.userId})
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             {editChild && (
  //               <>
  //                 <input
  //                   type="text"
  //                   value={editChild.childName || ''}
  //                   onChange={e => setEditChild({ ...editChild, childName: e.target.value })}
  //                   placeholder="Child Name"
  //                 />
  //                 <input
  //                   type="text"
  //                   value={editChild.phone || ''}
  //                   onChange={e => setEditChild({ ...editChild, phone: e.target.value })}
  //                   placeholder="Phone"
  //                 />
  //                 <input
  //                   type="text"
  //                   value={editChild.userId || ''}
  //                   onChange={e => setEditChild({ ...editChild, userId: e.target.value })}
  //                   placeholder="User ID"
  //                 />
  //                 <button onClick={handleUpdateChild}>Update Details</button>
  //                 <button onClick={() => handleResetPassword(editChild._id)}>Reset Password</button>
  //                 <button onClick={() => handleToggleStatus(editChild._id, editChild.isActive)}>
  //                   {editChild.isActive ? 'Deactivate' : 'Activate'}
  //                 </button>
  //                 <button onClick={() => setEditChild(null)}>Cancel</button>
  //               </>
  //             )}
  //             {!editChild && <p>Please select a child to update.</p>}
  //           </div>
  //         )}

  //         {activeSection === 'delete' && (
  //           <div className="child-list">
  //             <h2>Delete Children</h2>
  //             {children.length > 0 ? (
  //               <table>
  //                 <thead>
  //                   <tr>
  //                     <th>Name</th>
  //                     <th>Phone</th>
  //                     <th>User ID</th>
  //                     <th>Status</th>
  //                     <th>Actions</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {children.map(child => (
  //                     <tr key={child._id}>
  //                       <td>{child.childName}</td>
  //                       <td>{child.phone}</td>
  //                       <td>{child.userId}</td>
  //                       <td>{child.isActive ? 'Active' : 'Inactive'}</td>
  //                       <td>
  //                         <button onClick={() => handleDeleteChild(child._id)}>Delete</button>
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             ) : (
  //               <p>No children to delete.</p>
  //             )}
  //           </div>
  //         )}

  //         {activeSection === 'seeReports' && (
  //           <div className="reports-section">
  //             <div className="child-selector">
  //               <h2>Select Child for Reports</h2>
  //               <select value={selectedChild || ''} onChange={e => handleChildSelect(e.target.value)}>
  //                 <option value="">Select a child</option>
  //                 {children.map(child => (
  //                   <option key={child.userId} value={child.userId}>
  //                     {child.childName} ({child.userId})
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             <div className="reports-grid">
  //               <div className="emotion-trends">
  //                 <h2>Emotion Trends</h2>
  //                 {isFetchingReports ? (
  //                   <p>Loading emotion trends...</p>
  //                 ) : emotionTrends.length > 0 ? (
  //                   <table>
  //                     <thead>
  //                       <tr>
  //                         <th>Date/Time</th>
  //                         <th>Emotion</th>
  //                         <th>Question</th>
  //                       </tr>
  //                     </thead>
  //                     <tbody>
  //                       {emotionTrends.map((trend, index) => (
  //                         <tr key={index}>
  //                           <td>{new Date(trend.timestamp).toLocaleString()}</td>
  //                           <td>{trend.emotion}</td>
  //                           <td>{trend.question}</td>
  //                         </tr>
  //                       ))}
  //                     </tbody>
  //                   </table>
  //                 ) : (
  //                   <p>No emotion data available for this child.</p>
  //                 )}
  //               </div>
  //               <div className="game-reports">
  //                 <h2>Game Reports</h2>
  //                 {isFetchingReports ? (
  //                   <p>Loading game reports...</p>
  //                 ) : gameReports.length > 0 ? (
  //                   <table>
  //                     <thead>
  //                       <tr>
  //                         <th>Completed At</th>
  //                         <th>Score</th>
  //                         <th>Question</th>
  //                         <th>Correct</th>
  //                         <th>Emotions</th>
  //                       </tr>
  //                     </thead>
  //                     <tbody>
  //                       {gameReports.map((report, index) => (
  //                         <tr key={index}>
  //                           <td>{new Date(report.completedAt).toLocaleString()}</td>
  //                           <td>{report.score}</td>
  //                           <td>{report.question}</td>
  //                           <td>{report.isCorrect ? 'Yes' : 'No'}</td>
  //                           <td>{report.emotions.join(', ')}</td>
  //                         </tr>
  //                       ))}
  //                     </tbody>
  //                   </table>
  //                 ) : (
  //                   <p>No game reports available for this child.</p>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //       <div className="footer">
  //         <button
  //           onClick={() => {
  //             localStorage.removeItem('admin_token');
  //             localStorage.removeItem('admin_id');
  //             navigate('/admin-login');
  //           }}
  //           className="back-btn"
  //         >
  //           Logout
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default Admin;
"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import io from "socket.io-client"
import Chart from "chart.js/auto"
import "../styles/admin.css"

const Admin = () => {
  const [activeSection, setActiveSection] = useState("register")
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [emotionTrends, setEmotionTrends] = useState([])
  const [gameReports, setGameReports] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [registerChild, setRegisterChild] = useState({
    childName: "",
    phone: "",
    userId: "",
  })
  const [editChild, setEditChild] = useState(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingReports, setIsFetchingReports] = useState(false)
  
  // Chart refs
  const emotionTrendsChartRef = useRef(null)
  const emotionDistributionChartRef = useRef(null)
  const gamePerformanceChartRef = useRef(null)
  
  // Chart instances
  const emotionTrendsChartInstance = useRef(null)
  const emotionDistributionChartInstance = useRef(null)
  const gamePerformanceChartInstance = useRef(null)
  
  const navigate = useNavigate()
  const socket = io("http://localhost:3000", { transports: ["websocket"], reconnectionAttempts: 5 })

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      console.log("No admin_token, redirecting to /admin-login")
      navigate("/admin-login")
      return
    }

    fetchChildren(token)

    socket.on("connect", () => console.log("Socket.IO connected"))
    socket.on("connect_error", (err) => console.error("Socket.IO connection error:", err.message))
    socket.on("emotionUpdate", ({ parentId, userId, emotion, question, timestamp }) => {
      if (parentId === localStorage.getItem("admin_id") && userId === selectedChild) {
        setEmotionTrends((prev) => {
          const newTrends = [...prev, { emotion, question, timestamp }]
          updateEmotionCharts(newTrends)
          return newTrends
        })
      }
    })
    socket.on("gameReportUpdate", ({ parentId, userId, score, emotions, question, isCorrect, completedAt }) => {
      if (parentId === localStorage.getItem("admin_id") && userId === selectedChild) {
        setGameReports((prev) => {
          const newReports = [...prev, { score, emotions, question, isCorrect, completedAt }]
          updateGamePerformanceChart(newReports)
          return newReports
        })
      }
    })
    socket.on("newChild", ({ parentId, child }) => {
      if (parentId === localStorage.getItem("admin_id")) {
        setChildren((prev) => [child, ...prev])
      }
    })
    socket.on("childUpdated", ({ parentId, child }) => {
      if (parentId === localStorage.getItem("admin_id")) {
        setChildren((prev) => prev.map((c) => (c._id === child._id ? child : c)))
      }
    })
    socket.on("childDeleted", ({ parentId, childId }) => {
      if (parentId === localStorage.getItem("admin_id")) {
        setChildren((prev) => prev.filter((c) => c._id !== childId))
      }
    })
    socket.on("childStatusUpdated", ({ parentId, child }) => {
      if (parentId === localStorage.getItem("admin_id")) {
        setChildren((prev) => prev.map((c) => (c._id === child._id ? child : c)))
      }
    })

    return () => socket.disconnect()
  }, [navigate, selectedChild])

  // Effect to update charts when data changes
  useEffect(() => {
    if (activeSection === "seeReports" && selectedChild) {
      updateEmotionCharts(emotionTrends)
      updateGamePerformanceChart(gameReports)
    }
  }, [activeSection, selectedChild, emotionTrends, gameReports])

  // Effect to clean up charts when component unmounts
  useEffect(() => {
    return () => {
      if (emotionTrendsChartInstance.current) {
        emotionTrendsChartInstance.current.destroy()
      }
      if (emotionDistributionChartInstance.current) {
        emotionDistributionChartInstance.current.destroy()
      }
      if (gamePerformanceChartInstance.current) {
        gamePerformanceChartInstance.current.destroy()
      }
    }
  }, [])

  const fetchChildren = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/admin/children", {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Fetched children:", res.data)
      setChildren(res.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching children:", error.response?.data || error.message)
      setMessage("Error fetching children")
      setIsLoading(false)
    }
  }

  const handleChildSelect = async (userId) => {
    setSelectedChild(userId)
    console.log("Selected child userId:", userId)
    setIsFetchingReports(true)
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.get(`http://localhost:3000/child/emotion-trends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Emotion trends response:", res.data)
      setEmotionTrends(res.data || [])
    } catch (error) {
      console.error("Error fetching emotion trends:", error.response?.data || error.message)
      setMessage("Error fetching emotion trends")
      setEmotionTrends([])
    }
    await fetchGameReport(userId)
    setIsFetchingReports(false)
    if (activeSection === "seeReports") {
      setActiveSection("seeReports")
    }
  }

  const fetchGameReport = async (userId) => {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.get(`http://localhost:3000/child/game-reports/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Game reports response:", res.data)
      setGameReports(res.data || [])
    } catch (error) {
      console.error("Error fetching game reports:", error.response?.data || error.message)
      setMessage("Error fetching game reports")
      setGameReports([])
    }
  }

  const updateEmotionCharts = (data) => {
    if (!data || data.length === 0 || !emotionTrendsChartRef.current || !emotionDistributionChartRef.current) return

    // Update Emotion Trends Chart
    updateEmotionTrendsChart(data)
    
    // Update Emotion Distribution Chart
    updateEmotionDistributionChart(data)
  }

  const updateEmotionTrendsChart = (data) => {
    // Process data for the chart
    const timestamps = []
    const emotions = {}
    const emotionCounts = {}

    // Get unique dates and emotions
    data.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString()
      if (!timestamps.includes(date)) {
        timestamps.push(date)
      }

      if (!emotions[item.emotion]) {
        emotions[item.emotion] = []
        emotionCounts[item.emotion] = {}
      }

      if (!emotionCounts[item.emotion][date]) {
        emotionCounts[item.emotion][date] = 0
      }

      emotionCounts[item.emotion][date]++
    })

    // Sort timestamps
    timestamps.sort((a, b) => new Date(a) - new Date(b))

    // Create datasets
    const datasets = Object.keys(emotions).map((emotion, index) => {
      const emotionData = timestamps.map((date) => emotionCounts[emotion][date] || 0)

      // Generate a color based on the emotion
      let color
      switch (emotion.toLowerCase()) {
        case "happy":
          color = "rgba(75, 192, 192, 0.7)"
          break
        case "sad":
          color = "rgba(54, 162, 235, 0.7)"
          break
        case "angry":
          color = "rgba(255, 99, 132, 0.7)"
          break
        case "neutral":
          color = "rgba(201, 203, 207, 0.7)"
          break
        default:
          // Generate a random color if emotion is not recognized
          const r = Math.floor(Math.random() * 255)
          const g = Math.floor(Math.random() * 255)
          const b = Math.floor(Math.random() * 255)
          color = `rgba(${r}, ${g}, ${b}, 0.7)`
      }

      return {
        label: emotion,
        data: emotionData,
        borderColor: color,
        backgroundColor: color.replace("0.7", "0.2"),
        tension: 0.4,
        fill: true,
      }
    })

    // Destroy previous chart if it exists
    if (emotionTrendsChartInstance.current) {
      emotionTrendsChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = emotionTrendsChartRef.current.getContext("2d")
    emotionTrendsChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Emotion Trends Over Time",
            font: {
              size: 16,
              weight: 'bold'
            }
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Frequency",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    })
  }

  const updateEmotionDistributionChart = (data) => {
    // Process data for the chart
    const emotionCounts = {}

    // Count occurrences of each emotion
    data.forEach((item) => {
      if (!emotionCounts[item.emotion]) {
        emotionCounts[item.emotion] = 0
      }
      emotionCounts[item.emotion]++
    })

    const emotions = Object.keys(emotionCounts)
    const counts = emotions.map((emotion) => emotionCounts[emotion])

    // Generate colors for each emotion
    const backgroundColors = emotions.map((emotion) => {
      switch (emotion.toLowerCase()) {
        case "happy":
          return "rgba(75, 192, 192, 0.7)"
        case "sad":
          return "rgba(54, 162, 235, 0.7)"
        case "angry":
          return "rgba(255, 99, 132, 0.7)"
        case "neutral":
          return "rgba(201, 203, 207, 0.7)"
        default:
          // Generate a random color if emotion is not recognized
          const r = Math.floor(Math.random() * 255)
          const g = Math.floor(Math.random() * 255)
          const b = Math.floor(Math.random() * 255)
          return `rgba(${r}, ${g}, ${b}, 0.7)`
      }
    })

    // Destroy previous chart if it exists
    if (emotionDistributionChartInstance.current) {
      emotionDistributionChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = emotionDistributionChartRef.current.getContext("2d")
    emotionDistributionChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: emotions,
        datasets: [
          {
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => color.replace("0.7", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Emotion Distribution",
            font: {
              size: 16,
              weight: 'bold'
            }
          },
        },
      },
    })
  }

  const updateGamePerformanceChart = (data) => {
    if (!data || data.length === 0 || !gamePerformanceChartRef.current) return

    // Process data for the chart
    const dates = []
    const scores = []
    const correctAnswers = []
    const incorrectAnswers = []

    // Group data by date
    const groupedData = {}

    data.forEach((item) => {
      const date = new Date(item.completedAt).toLocaleDateString()

      if (!groupedData[date]) {
        groupedData[date] = {
          scores: [],
          correct: 0,
          incorrect: 0,
        }
      }

      groupedData[date].scores.push(item.score)
      if (item.isCorrect) {
        groupedData[date].correct++
      } else {
        groupedData[date].incorrect++
      }
    })

    // Prepare data for chart
    Object.keys(groupedData)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((date) => {
        dates.push(date)

        // Calculate average score for the day
        const avgScore =
          groupedData[date].scores.reduce((sum, score) => sum + score, 0) / groupedData[date].scores.length
        scores.push(avgScore)

        correctAnswers.push(groupedData[date].correct)
        incorrectAnswers.push(groupedData[date].incorrect)
      })

    // Destroy previous chart if it exists
    if (gamePerformanceChartInstance.current) {
      gamePerformanceChartInstance.current.destroy()
    }

    // Create new chart
    const ctx = gamePerformanceChartRef.current.getContext("2d")
    gamePerformanceChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Average Score",
            data: scores,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            type: "line",
            yAxisID: "y",
            tension: 0.4,
          },
          {
            label: "Correct Answers",
            data: correctAnswers,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            yAxisID: "y1",
          },
          {
            label: "Incorrect Answers",
            data: incorrectAnswers,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Game Performance",
            font: {
              size: 16,
              weight: 'bold'
            }
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Score",
            },
            min: 0,
            max: 100,
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Count",
            },
            min: 0,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    })
  }

  const handleSearch = () => {
    const child = children.find((c) => c.childName.toLowerCase().includes(searchQuery.toLowerCase()))
    if (child) {
      console.log("Search found child:", child)
      handleChildSelect(child.userId)
    } else {
      setMessage("Child not found")
    }
  }

  const handleRegisterChild = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("admin_token")
    if (!token) {
      navigate("/admin-login")
      return
    }
    if (!/^\d{6}$/.test(registerChild.userId)) {
      setMessage("User ID must be a 6-digit number")
      return
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/admin/register-child",
        {
          ...registerChild,
          password: registerChild.userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage(res.data.message)
      setRegisterChild({ childName: "", phone: "", userId: "" })
      fetchChildren(token)
    } catch (error) {
      console.error("Error registering child:", error.response?.data || error.message)
      setMessage(error.response?.data?.message || "Registration failed")
    }
  }

  const handleUpdateChild = async () => {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.put(
        `http://localhost:3000/admin/children/${editChild._id}/edit`,
        {
          childName: editChild.childName,
          phone: editChild.phone,
          userId: editChild.userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage(res.data.message)
      setEditChild(null)
      fetchChildren(token)
      setActiveSection("listOfChildren")
    } catch (error) {
      console.error("Error updating child:", error.response?.data || error.message)
      setMessage(error.response?.data?.message || "Update failed")
    }
  }

  const handleResetPassword = async (childId) => {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.post(
        `http://localhost:3000/admin/children/${childId}/reset-password`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage(`Password reset. Temporary password: ${res.data.temporaryPassword}`)
    } catch (error) {
      console.error("Error resetting password:", error.response?.data || error.message)
      setMessage(error.response?.data?.message || "Reset failed")
    }
  }

  const handleToggleStatus = async (childId, isActive) => {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.patch(
        `http://localhost:3000/admin/children/${childId}/status`,
        { isActive: !isActive },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage(res.data.message)
      fetchChildren(token)
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message)
      setMessage(error.response?.data?.message || "Status update failed")
    }
  }

  const handleDeleteChild = async (childId) => {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await axios.delete(`http://localhost:3000/admin/children/${childId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(res.data.message)
      fetchChildren(token)
    } catch (error) {
      console.error("Error deleting child:", error.response?.data || error.message)
      setMessage(error.response?.data?.message || "Deletion failed")
    }
  }

  if (isLoading) {
    return <div className="admin-container">Loading...</div>
  }

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <button onClick={() => setActiveSection("register")}>Register</button>
        <button onClick={() => setActiveSection("listOfChildren")}>List of Children</button>
        <button onClick={() => setActiveSection("update")}>Update</button>
        <button onClick={() => setActiveSection("delete")}>Delete</button>
        <button onClick={() => setActiveSection("seeReports")}>See Reports</button>
      </nav>
      <h1>Admin Panel</h1>
      {message && <p className="message">{message}</p>}

      <div className="admin-content">
        {activeSection === "register" && (
          <div className="child-registration">
            <h2>Register New Child</h2>
            <form onSubmit={handleRegisterChild}>
              <input
                type="text"
                placeholder="Child Name"
                value={registerChild.childName}
                onChange={(e) => setRegisterChild({ ...registerChild, childName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={registerChild.phone}
                onChange={(e) => setRegisterChild({ ...registerChild, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="6-Digit User ID"
                value={registerChild.userId}
                onChange={(e) => setRegisterChild({ ...registerChild, userId: e.target.value })}
                required
              />
              <button type="submit">Register Child</button>
            </form>
          </div>
        )}

        {activeSection === "listOfChildren" && (
          <div className="child-list">
            <h2>Registered Children</h2>
            {children.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>User ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child._id}>
                      <td>{child.childName}</td>
                      <td>{child.phone}</td>
                      <td>{child.userId}</td>
                      <td>{child.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No children registered yet.</p>
            )}
          </div>
        )}

        {activeSection === "update" && (
          <div className="edit-child">
            <h2>Update Child</h2>
            <div className="child-selector">
              <select
                value={editChild ? editChild._id : ""}
                onChange={(e) => {
                  const child = children.find((c) => c._id === e.target.value)
                  setEditChild(child || null)
                }}
              >
                <option value="">Select a child</option>
                {children.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.childName} ({child.userId})
                  </option>
                ))}
              </select>
            </div>
            {editChild && (
              <>
                <input
                  type="text"
                  value={editChild.childName || ""}
                  onChange={(e) => setEditChild({ ...editChild, childName: e.target.value })}
                  placeholder="Child Name"
                />
                <input
                  type="text"
                  value={editChild.phone || ""}
                  onChange={(e) => setEditChild({ ...editChild, phone: e.target.value })}
                  placeholder="Phone"
                />
                <input
                  type="text"
                  value={editChild.userId || ""}
                  onChange={(e) => setEditChild({ ...editChild, userId: e.target.value })}
                  placeholder="User ID"
                />
                <button onClick={handleUpdateChild}>Update Details</button>
                <button onClick={() => handleResetPassword(editChild._id)}>Reset Password</button>
                <button onClick={() => handleToggleStatus(editChild._id, editChild.isActive)}>
                  {editChild.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => setEditChild(null)}>Cancel</button>
              </>
            )}
            {!editChild && <p>Please select a child to update.</p>}
          </div>
        )}

        {activeSection === "delete" && (
          <div className="child-list">
            <h2>Delete Children</h2>
            {children.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>User ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child._id}>
                      <td>{child.childName}</td>
                      <td>{child.phone}</td>
                      <td>{child.userId}</td>
                      <td>{child.isActive ? "Active" : "Inactive"}</td>
                      <td>
                        <button onClick={() => handleDeleteChild(child._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No children to delete.</p>
            )}
          </div>
        )}

        {activeSection === "seeReports" && (
          <div className="reports-section">
            <h2>Select Child for Reports</h2>
            <div className="child-selector">
              <select value={selectedChild || ""} onChange={(e) => handleChildSelect(e.target.value)}>
                <option value="">Select a child</option>
                {children.map((child) => (
                  <option key={child.userId} value={child.userId}>
                    {child.childName} ({child.userId})
                  </option>
                ))}
              </select>
            </div>

            {selectedChild && !isFetchingReports ? (
              <div className="reports-grid">
                <div className="chart-card emotion-trends-chart">
                  <div className="chart-container">
                    <canvas ref={emotionTrendsChartRef}></canvas>
                  </div>
                </div>

                <div className="chart-card emotion-distribution-chart">
                  <div className="chart-container">
                    <canvas ref={emotionDistributionChartRef}></canvas>
                  </div>
                </div>

                <div className="chart-card game-performance-chart">
                  <div className="chart-container">
                    <canvas ref={gamePerformanceChartRef}></canvas>
                  </div>
                </div>

                <div className="chart-card recent-reports">
                  <h2>Recent Game Reports</h2>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Question</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameReports.slice(0, 5).map((report, index) => (
                          <tr key={index}>
                            <td>{new Date(report.completedAt).toLocaleDateString()}</td>
                            <td>{report.score}</td>
                            <td>{report.question}</td>
                            <td className={report.isCorrect ? "correct" : "incorrect"}>
                              {report.isCorrect ? "Correct" : "Incorrect"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : isFetchingReports ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading reports...</p>
              </div>
            ) : (
              <p>Please select a child to view reports.</p>
            )}
          </div>
        )}
      </div>

      <div className="footer">
        <button
          onClick={() => {
            localStorage.removeItem("admin_token")
            localStorage.removeItem("admin_id")
            navigate("/admin-login")
          }}
          className="back-btn"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Admin
