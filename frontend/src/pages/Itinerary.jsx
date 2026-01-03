import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import '../styles/itinerary.css';

const Itinerary = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [newActivity, setNewActivity] = useState({ name: '', cost: '' });
  const [newStop, setNewStop] = useState({
    city: '',
    country: '',
    arrival: '',
    departure: '',
    notes: ''
  });
  const [budgetLimit, setBudgetLimit] = useState(153550);
  const [tempBudgetInput, setTempBudgetInput] = useState('153550');

  const [stops, setStops] = useState([
    {
      id: 1,
      city: 'London, UK',
      dates: 'May 10 – May 15',
      activities: [
        { id: 1, name: 'Visit the Tower of London', cost: 3320 },
        { id: 2, name: 'London Eye', cost: 2905 },
        { id: 3, name: 'West End Show', cost: 5810 }
      ]
    },
    {
      id: 2,
      city: 'Paris, France',
      dates: 'May 16 – May 20',
      activities: [
        { id: 1, name: 'Eiffel Tower Summit', cost: 2490 },
        { id: 2, name: 'Louvre Museum', cost: 2075 },
        { id: 3, name: 'Seine River Cruise', cost: 2075 }
      ]
    },
    {
      id: 3,
      city: 'Rome, Italy',
      dates: 'May 21 – May 25',
      activities: [
        { id: 1, name: 'Colosseum & Forum', cost: 3735 },
        { id: 2, name: 'Vatican Tour', cost: 4150 },
        { id: 3, name: 'Trevi Fountain', cost: 0 }
      ]
    }
  ]);

  // Calculate total cost from all activities
  const calculateTotalCost = () => {
    return stops.reduce((total, stop) => {
      return total + stop.activities.reduce((stopTotal, activity) => stopTotal + activity.cost, 0);
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const remainingBudget = budgetLimit - totalCost;
  const budgetPercentage = (totalCost / budgetLimit) * 100;
  const isOverBudget = totalCost > budgetLimit;

  const handleUpdateBudget = () => {
    const newBudget = parseInt(tempBudgetInput) || budgetLimit;
    setBudgetLimit(newBudget);
    setEditingBudget(false);
  };

  const handleAddStop = () => {
    if (newStop.city && newStop.country) {
      const newStopData = {
        id: Math.max(...stops.map(s => s.id), 0) + 1,
        city: `${newStop.city}, ${newStop.country}`,
        dates: `${newStop.arrival} – ${newStop.departure}`,
        activities: []
      };
      setStops([...stops, newStopData]);
      setShowModal(false);
      setNewStop({ city: '', country: '', arrival: '', departure: '', notes: '' });
    }
  };

  const handleDeleteStop = (stopId) => {
    setStops(stops.filter(stop => stop.id !== stopId));
  };

  const handleAddActivity = () => {
    if (newActivity.name && newActivity.cost && selectedStopId !== null) {
      const costValue = parseInt(newActivity.cost.replace(/[^\d]/g, '')) || 0;
      setStops(stops.map(stop => {
        if (stop.id === selectedStopId) {
          return {
            ...stop,
            activities: [...stop.activities, { id: Date.now(), name: newActivity.name, cost: costValue }]
          };
        }
        return stop;
      }));
      setNewActivity({ name: '', cost: '' });
      setShowActivityModal(false);
    }
  };

  const handleDeleteActivity = (stopId, activityId) => {
    setStops(stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: stop.activities.filter(activity => activity.id !== activityId)
        };
      }
      return stop;
    }));
  };

  return (
    <div className="itinerary-page">
      <div className="itinerary-hero">
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Trips
        </Button>
        <h1>Grand European Journey</h1>
        <p>From May 10, 2025 to June 15, 2025</p>
      </div>

      <div className="itinerary-content">
        <div className="timeline-section">
          <div className="timeline-header">
            <h2>Your Journey Timeline</h2>
            <Button onClick={() => setShowModal(true)}>+ Add Stop</Button>
          </div>

          <div className="timeline">
            {stops.map((stop, index) => (
              <div key={stop.id} className="timeline-item">
                <div className="timeline-marker">{index + 1}</div>
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div>
                      <h3>{stop.city}</h3>
                      <span>{stop.dates}</span>
                    </div>
                    <button
                      className="delete-stop-btn"
                      onClick={() => handleDeleteStop(stop.id)}
                      title="Remove this stop"
                    >
                      ✕
                    </button>
                  </div>
                  <ul>
                    {stop.activities.map((activity) => (
                      <li key={activity.id} className="activity-item">
                        <span>{activity.name} – ₹{activity.cost.toLocaleString('en-IN')}</span>
                        <button
                          className="delete-activity-btn"
                          onClick={() => handleDeleteActivity(stop.id, activity.id)}
                          title="Remove activity"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="add-activity-btn"
                    onClick={() => {
                      setSelectedStopId(stop.id);
                      setShowActivityModal(true);
                    }}
                  >
                    + Add Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="budget-section">
          <h2>Budget Summary</h2>
          {isOverBudget && (
            <div className="budget-alert">
              ⚠️ Over Budget: You've exceeded by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </div>
          )}
          <div className={`budget-card ${isOverBudget ? 'over-budget' : ''}`}>
            <div className="budget-header">
              <div className="budget-icon">💰</div>
              <span className={`status-badge ${isOverBudget ? 'warning' : 'success'}`}>
                {isOverBudget ? '⚠️ Over Budget' : '✓ Within Budget'}
              </span>
            </div>
            <div className="budget-progress">
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${isOverBudget ? 'over' : ''}`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              <p className="progress-text">{Math.min(Math.round(budgetPercentage), 100)}% of budget used</p>
            </div>
            <div className="budget-details">
              <div className="budget-row">
                <span>Total Spent:</span>
                <span className={isOverBudget ? 'over-text' : ''}>₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="budget-row">
                <span>Budget Limit:</span>
                <span>₹{budgetLimit.toLocaleString('en-IN')}</span>
              </div>
              <div className={`budget-row remaining ${isOverBudget ? 'negative' : 'positive'}`}>
                <span>Remaining:</span>
                <span>₹{Math.abs(remainingBudget).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="budget-actions">
              {!editingBudget ? (
                <button 
                  className="edit-budget-btn"
                  onClick={() => {
                    setEditingBudget(true);
                    setTempBudgetInput(budgetLimit.toString());
                  }}
                >
                  ✏️ Edit Budget
                </button>
              ) : (
                <div className="budget-input-group">
                  <input
                    type="number"
                    value={tempBudgetInput}
                    onChange={(e) => setTempBudgetInput(e.target.value)}
                    placeholder="Enter budget"
                    className="budget-input"
                  />
                  <button className="save-budget-btn" onClick={handleUpdateBudget}>
                    Save
                  </button>
                  <button className="cancel-budget-btn" onClick={() => setEditingBudget(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="budget-tips">
              <p>💡 <strong>Tip:</strong> {
                isOverBudget 
                  ? 'Remove activities or increase budget to stay on track.'
                  : remainingBudget < 5000 
                  ? 'Limited budget left. Plan carefully!'
                  : 'Good budget flexibility. Enjoy your trip!'
              }</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Destination</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add a new stop to your journey</p>
            <Input
              label="City"
              placeholder="e.g., Barcelona"
              value={newStop.city}
              onChange={(e) => setNewStop({ ...newStop, city: e.target.value })}
              required
            />
            <Input
              label="Country"
              placeholder="e.g., Spain"
              value={newStop.country}
              onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
              required
            />
            <div className="modal-form-row">
              <Input
                type="date"
                label="Arrival"
                value={newStop.arrival}
                onChange={(e) => setNewStop({ ...newStop, arrival: e.target.value })}
              />
              <Input
                type="date"
                label="Departure"
                value={newStop.departure}
                onChange={(e) => setNewStop({ ...newStop, departure: e.target.value })}
              />
            </div>
            <Input
              label="Notes (Optional)"
              placeholder="What do you want to do here?"
              value={newStop.notes}
              onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStop}>Add to Journey</Button>
            </div>
          </div>
        </div>
      )}

      {showActivityModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Activity</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add something to do at this stop</p>
            <Input
              label="Activity Name"
              placeholder="e.g., Eiffel Tower Summit"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              required
            />
            <Input
              label="Cost (₹)"
              type="number"
              placeholder="e.g., 2490"
              value={newActivity.cost}
              onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
              required
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowActivityModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddActivity}>Add Activity</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
