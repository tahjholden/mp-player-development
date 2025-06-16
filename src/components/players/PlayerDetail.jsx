import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playerService, parentService } from '../../lib/supabase';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [player, setPlayer] = useState({
    first_name: '',
    last_name: '',
    position: '',
    group_id: ''
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [parents, setParents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!isNew) {
        const data = await playerService.getPlayerWithParents(id);
        if (data) {
          setPlayer(data.player);
          setParents(data.parents || []);
        }
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      let result;
      if (isNew) {
        result = await playerService.create(player);
      } else {
        result = await playerService.update(id, player);
      }
      
      if (result) {
        navigate('/players');
      } else {
        setError('Failed to save player');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? 'Add New Player' : `Edit Player: ${player.first_name} ${player.last_name}`}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={player.first_name || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={player.last_name || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={player.position || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="group_id">
            Group ID
          </label>
          <input
            type="text"
            id="group_id"
            name="group_id"
            value={player.group_id || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        {!isNew && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Parents</h3>
            {parents.length > 0 ? (
              <ul className="bg-gray-50 rounded border p-4">
                {parents.map(parent => (
                  <li key={parent.id} className="mb-1">
                    {parent.first_name} {parent.last_name} - {parent.email || 'No email'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No parents assigned</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/players')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerDetail;
