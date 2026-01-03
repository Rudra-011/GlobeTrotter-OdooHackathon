import { useState } from 'react';
import '../styles/profile.css';
import Button from '../components/common/Button';

const Profile = () => {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80');
  const [plannedTrips, setPlannedTrips] = useState([
    {
      id: 1,
      title: 'Paris Getaway',
      location: 'Paris, France',
      dates: 'Apr 12 - Apr 18, 2026',
      budget: '₹1.2L',
      summary: 'Food tour, Louvre, Seine sunset cruise, Montmartre walk.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 2,
      title: 'Bali Adventure',
      location: 'Ubud & Uluwatu, Indonesia',
      dates: 'Jun 02 - Jun 10, 2026',
      budget: '₹95K',
      summary: 'Surf lessons, rice terraces, temples, spa day, beach clubs.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: '',
    summary: '',
    image: ''
  });

  const previousTrips = [
    {
      id: 3,
      title: 'Dubai Escape',
      location: 'Dubai, UAE',
      dates: 'Dec 15 - Dec 19, 2025',
      budget: '₹1.4L',
      summary: 'Skyline views, desert safari, Marina dhow cruise, souk shopping.',
      image: 'https://images.unsplash.com/photo-1504272017915-28a5b40a0a7e?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 4,
      title: 'Swiss Alps Loop',
      location: 'Interlaken & Zermatt, Switzerland',
      dates: 'Sep 05 - Sep 11, 2025',
      budget: '₹1.8L',
      summary: 'Jungfraujoch ride, Matterhorn view, glacier lakes, fondue nights.',
      image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const removeImage = () => setProfileImage(null);

  const handleTripFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budget') {
      const numeric = value.replace(/[^0-9]/g, '');
      setNewTrip(prev => ({ ...prev, [name]: numeric }));
      return;
    }
    setNewTrip(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTrip = (e) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.location || !newTrip.startDate || !newTrip.endDate || !newTrip.summary) {
      alert('Please fill title, location, dates, and summary.');
      return;
    }

    const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';
    const budgetValue = newTrip.budget ? Number(newTrip.budget) : null;
    const budgetLabel = budgetValue ? `₹${budgetValue.toLocaleString('en-IN')}` : '₹—';
    const datesLabel = `${newTrip.startDate} - ${newTrip.endDate}`;

    const created = {
      id: Date.now(),
      title: newTrip.title,
      location: newTrip.location,
      dates: datesLabel,
      budget: budgetLabel,
      summary: newTrip.summary,
      image: newTrip.image || fallbackImage
    };

    setPlannedTrips(prev => [created, ...prev]);
    setShowAddModal(false);
    setNewTrip({ title: '', location: '', startDate: '', endDate: '', budget: '', summary: '', image: '' });
  };

  const handleDeleteTrip = (id) => {
    setPlannedTrips(prev => prev.filter(trip => trip.id !== id));
    if (selectedTrip?.id === id) setSelectedTrip(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-image-section">
          <div className="profile-image-wrapper">
            <div className="profile-image">
              {profileImage ? <img src={profileImage} alt="User" /> : <span>Photo</span>}
            </div>
            <label className="camera-btn" title="Update photo">
              📷
              <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
            </label>
          </div>
          {profileImage && (
            <button className="remove-img" onClick={removeImage}>Remove</button>
          )}
        </div>

        <div className="profile-details">
          <h2>User Details</h2>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Country:</strong> India</p>
          <p><strong>Role:</strong> Traveler & Planner</p>
          <p><strong>Member since:</strong> 2024</p>
          <p><strong>Trips planned:</strong> 8</p>
          <Button>Edit Profile</Button>
        </div>
      </div>

      <section>
        <div className="section-header">
          <h3 className="section-title">Preplanned Trips</h3>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Add Trip</Button>
        </div>
        <div className="trip-grid">
          {plannedTrips.map(trip => (
            <div key={trip.id} className="trip-card">
              <img src={trip.image} alt={trip.title} className="trip-thumb" />
              <div className="trip-info">
                <h4>{trip.title}</h4>
                <p className="trip-meta">{trip.location} • {trip.dates}</p>
                <p className="trip-desc">{trip.summary}</p>
                <div className="trip-footer">
                  <span className="trip-chip">{trip.budget}</span>
                  <div className="trip-actions">
                    <Button variant="primary" onClick={() => setSelectedTrip(trip)}>View</Button>
                    <button className="remove-trip" onClick={() => handleDeleteTrip(trip.id)}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-title">Previous Trips</h3>
        <div className="trip-grid">
          {previousTrips.map(trip => (
            <div key={trip.id} className="trip-card">
              <img src={trip.image} alt={trip.title} className="trip-thumb" />
              <div className="trip-info">
                <h4>{trip.title}</h4>
                <p className="trip-meta">{trip.location} • {trip.dates}</p>
                <p className="trip-desc">{trip.summary}</p>
                <div className="trip-footer">
                  <span className="trip-chip">{trip.budget}</span>
                  <Button variant="secondary">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTrip && (
        <div className="modal-overlay" onClick={() => setSelectedTrip(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={selectedTrip.image} alt={selectedTrip.title} className="modal-thumb" />
            <h3>{selectedTrip.title}</h3>
            <p className="modal-meta">{selectedTrip.location} • {selectedTrip.dates}</p>
            <p className="modal-summary">{selectedTrip.summary}</p>
            <p className="modal-budget">Budget: {selectedTrip.budget}</p>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setSelectedTrip(null)}>Close</Button>
              <Button variant="primary">Open Itinerary</Button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Trip</h3>
            <form className="modal-form" onSubmit={handleAddTrip}>
              <div className="form-row">
                <label>Title
                  <input name="title" value={newTrip.title} onChange={handleTripFieldChange} placeholder="e.g., Tokyo Highlights" />
                </label>
                <label>Location
                  <input name="location" value={newTrip.location} onChange={handleTripFieldChange} placeholder="City, Country" />
                </label>
              </div>
              <div className="form-row">
                <label>Start Date
                  <input type="date" name="startDate" value={newTrip.startDate} onChange={handleTripFieldChange} />
                </label>
                <label>End Date
                  <input type="date" name="endDate" value={newTrip.endDate} onChange={handleTripFieldChange} />
                </label>
              </div>
              <div className="form-row">
                <label>Budget (₹)
                  <input
                    type="number"
                    name="budget"
                    value={newTrip.budget}
                    onChange={handleTripFieldChange}
                    placeholder="120000"
                    min="0"
                    step="100"
                  />
                </label>
                <label>Image URL
                  <input name="image" value={newTrip.image} onChange={handleTripFieldChange} placeholder="https://..." />
                </label>
              </div>
              <label>Summary / Plans
                <textarea name="summary" value={newTrip.summary} onChange={handleTripFieldChange} placeholder="Key activities, notes, must-dos" rows="3" />
              </label>
              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Trip</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
