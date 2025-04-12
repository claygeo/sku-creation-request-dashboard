import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../utils/supabase';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const CheckStatus = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Load local requests using the exposed electron.store API
      const localRequests = window.electron?.store?.get('requests', []) || [];
      setRequests(localRequests);

      // Sync with Supabase if online
      const syncRequests = async () => {
        try {
          const { data, error } = await supabase.from('sku_requests').select('*');
          if (error) throw error;
          setRequests(data);
          window.electron?.store?.set('requests', data); // Update local storage with synced data
        } catch (error) {
          console.error('Error fetching requests from Supabase:', error);
          toast.error('Error fetching requests from Supabase. Showing local data.');
        }
      };
      syncRequests();
    } catch (err) {
      setError('Failed to load requests. Please try again later.');
      console.error(err);
    }
  }, []);

  // Function to format the timestamp in 12-hour format in Eastern Time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';

    try {
      // Log the raw timestamp to debug
      console.log('Raw timestamp:', timestamp);

      // Parse the UTC timestamp
      const date = new Date(timestamp);
      console.log('Parsed UTC date:', date);

      // Convert the UTC timestamp to Eastern Time (America/New_York)
      const easternTime = toZonedTime(date, 'America/New_York');
      console.log('Eastern Time:', easternTime);

      // Format the date in 12-hour format
      const formattedDate = format(easternTime, 'M/d/yyyy, h:mm a');
      console.log('Formatted Eastern Time:', formattedDate);

      return formattedDate;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      // Fallback to local timezone if conversion fails
      return format(new Date(timestamp), 'M/d/yyyy, h:mm a');
    }
  };

  const handleCancel = async (id) => {
    try {
      // Update local storage
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: 'Cancelled' } : req
      );
      window.electron?.store?.set('requests', updatedRequests);
      setRequests(updatedRequests);

      // Update Supabase
      const { error } = await supabase
        .from('sku_requests')
        .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast.success('Request cancelled successfully!');
    } catch (error) {
      console.error('Error updating request in Supabase:', error);
      toast.error('Error updating request in Supabase. Changes saved locally.');
    }
  };

  if (error) {
    return (
      <div className="main-content">
        <h1>🌟 Request Status 🌟</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <div className="form-actions" style={{ marginBottom: '20px' }}>
          <button type="button" className="back-btn" onClick={() => navigate('/')}>
            Back to Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>🌟 Request Status 🌟</h1>
      <div className="form-actions" style={{ marginBottom: '20px' }}>
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          Back to Main Menu
        </button>
      </div>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date Requested</th>
              <th>Distributor Menu Name</th>
              <th>Status</th>
              <th>Completed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{formatTimestamp(req.created_at)}</td>
                <td>{req.distributorMenuName}</td>
                <td>{req.status}</td>
                <td>{req.completed_by || 'N/A'}</td>
                <td>
                  {req.status === 'Pending' && (
                    <button onClick={() => handleCancel(req.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CheckStatus;