import React, { useState, useEffect } from 'react';
import BaseFormModal from './BaseFormModal';
import VoiceInputField from '../../common/VoiceInputField';
import { supabase, TABLES, activityLogService } from '../../../lib/supabase';
import { 
  Box, 
  FormControl, 
  FormHelperText, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel 
} from '@mui/material';

/**
 * AddPDPModal - Modal for adding a new Personal Development Plan with voice dictation support
 * 
 * @param {Object} props
 * @param {Array} props.players - List of available players
 * @param {Object} props.selectedPlayer - Pre-selected player (if opened from player card)
 * @param {Array} props.coaches - List of available coaches
 * @param {function} props.onSubmit - Function to handle the form submission
 * @param {function} props.onClose - Function to close the modal
 * @param {Object} props.currentUser - Current logged in user/coach
 */
const AddPDPModal = ({ players, selectedPlayer, coaches, onSubmit, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    player_id: selectedPlayer ? selectedPlayer.id : '',
    coach_id: currentUser?.id || '',
    content: '',
    start_date: new Date().toISOString().split('T')[0],
    active: true
  });
  
  const [searchTerm, setSearchTerm] = useState(selectedPlayer ? `${selectedPlayer.first_name} ${selectedPlayer.last_name}` : '');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [errors, setErrors] = useState({
    player_id: '',
    content: ''
  });

  // Filter players based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlayers(players.slice(0, 5)); // Show first 5 players initially
    } else {
      const filtered = players.filter(player => 
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchTerm, players]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePlayerSelect = (player) => {
    setFormData({
      ...formData,
      player_id: player.id
    });
    setSearchTerm(`${player.first_name} ${player.last_name}`);
    setShowPlayerDropdown(false);
    
    // Clear player error
    if (errors.player_id) {
      setErrors({
        ...errors,
        player_id: ''
      });
    }
  };

  const handlePlayerSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowPlayerDropdown(true);
  };

  const handleSubmit = async () => {
    // Validation
    const newErrors = {};
    let isValid = true;
    
    if (!formData.player_id) {
      newErrors.player_id = 'Please select a player';
      isValid = false;
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'PDP content is required';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      // First, mark any existing active PDPs for this player as inactive
      const { data: existingPdps, error: fetchError } = await supabase
        .from(TABLES.PDP)
        .select('*')
        .eq('player_id', formData.player_id)
        .eq('active', true);
      
      if (fetchError) throw fetchError;
      
      // Update any existing active PDPs to be inactive
      if (existingPdps && existingPdps.length > 0) {
        const { error: updateError } = await supabase
          .from(TABLES.PDP)
          .update({ active: false, end_date: new Date().toISOString() })
          .eq('player_id', formData.player_id)
          .eq('active', true);
        
        if (updateError) throw updateError;
      }
      
      // Create the new PDP
      const { data: newPdp, error: createError } = await supabase
        .from(TABLES.PDP)
        .insert([formData])
        .select();
      
      if (createError) throw createError;
      
      // Log activity
      if (newPdp && newPdp[0]) {
        await activityLogService.create({
          activity_type: 'pdp_created',
          summary: `New PDP created for player`,
          coach_id: formData.coach_id,
          pdp_id: newPdp[0].id
        });
      }
      
      // Call the onSubmit callback with the result
      if (onSubmit) {
        await onSubmit(newPdp[0]);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating PDP:', error);
      alert('Failed to create PDP. Please try again.');
    }
  };

  const oldGold = '#CFB53B';

  return (
    <BaseFormModal 
      title="Add Development Plan" 
      onClose={onClose} 
      onSubmit={handleSubmit}
      submitButtonText="Create Plan"
      submitButtonProps={{ sx: { backgroundColor: oldGold, '&:hover': { backgroundColor: '#BFA52B' } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth error={!!errors.player_id}>
          <Typography sx={{ color: oldGold, mb: 1, fontWeight: 500 }}>Player</Typography>
          <Box sx={{ position: 'relative' }}>
            <input 
              type="text" 
              value={searchTerm}
              onChange={handlePlayerSearch}
              onFocus={() => setShowPlayerDropdown(true)}
              placeholder="Search for player"
              autoComplete="off"
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#1a1a1a', 
                border: `1px solid ${errors.player_id ? '#f44336' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '4px',
                color: 'white'
              }}
            />
            
            {showPlayerDropdown && filteredPlayers.length > 0 && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  zIndex: 10, 
                  width: '100%', 
                  mt: 0.5, 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '4px', 
                  maxHeight: '200px', 
                  overflowY: 'auto'
                }}
              >
                {filteredPlayers.map((player) => (
                  <Box 
                    key={player.id} 
                    sx={{ 
                      p: 1.5, 
                      '&:hover': { backgroundColor: 'rgba(207, 181, 59, 0.2)' }, 
                      cursor: 'pointer'
                    }}
                    onClick={() => handlePlayerSelect(player)}
                  >
                    {player.first_name} {player.last_name}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {errors.player_id && <FormHelperText error>{errors.player_id}</FormHelperText>}
        </FormControl>

        {coaches && coaches.length > 0 && (
          <FormControl fullWidth>
            <Typography sx={{ color: oldGold, mb: 1, fontWeight: 500 }}>Coach</Typography>
            <Select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              displayEmpty
              sx={{ 
                backgroundColor: '#1a1a1a', 
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: oldGold
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <MenuItem value="" disabled>Select a coach</MenuItem>
              {coaches.map((coach) => (
                <MenuItem key={coach.id} value={coach.id}>
                  {coach.first_name} {coach.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth>
          <Typography sx={{ color: oldGold, mb: 1, fontWeight: 500 }}>Start Date</Typography>
          <input 
            type="date" 
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#1a1a1a', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              color: 'white'
            }}
          />
        </FormControl>

        <FormControl fullWidth error={!!errors.content}>
          <Typography sx={{ color: oldGold, mb: 1, fontWeight: 500 }}>Development Plan Content</Typography>
          <VoiceInputField
            type="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter development plan details here..."
            rows={5}
            error={errors.content}
            sx={{ 
              '& .MuiInputBase-root': { 
                backgroundColor: '#1a1a1a', 
                color: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: oldGold
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: oldGold
              }
            }}
          />
        </FormControl>
        
        <Box sx={{ mt: 1, color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
          <Typography variant="caption">
            Tap the mic icon to use voice dictation, or type manually.
          </Typography>
        </Box>
      </Box>
    </BaseFormModal>
  );
};

export default AddPDPModal;
