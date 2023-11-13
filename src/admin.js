import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc,collection,getDocs,updateDoc, addDoc } from 'firebase/firestore';
import { firestore } from './config/firebase';
import DatePicker from 'react-datepicker';
import './css/admin.css';
const Admin = () => {
  const [user,setUser]=useState("");
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newParty, setNewParty] = useState('');
  const [newCandidate, setNewCandidate] = useState('');
  const [votingDate, setVotingDate] = useState(new Date());
  const [notification, setNotification] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [showAddPartyPopup, setShowAddPartyPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isEditing, setIsEditing] = useState([]);
  const [editedCandidate, setEditedCandidate] = useState([]);
  const [voters, setVoters] = useState([]);
  const [party, setParties] = useState([]);
  
  

 
  useEffect(() => {
    const auth = getAuth();
    
    // Use onAuthStateChanged to get the current user once when the component mounts
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Fetch user data
          const userDocRef = doc(firestore, 'User', authUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              role:userData.role,
            });
          }

          // Fetch candidates data
          const candidatesCollectionRef = collection(firestore, 'candidates');
          const candidatesSnapshot = await getDocs(candidatesCollectionRef);
          const candidatesData = [];

          candidatesSnapshot.forEach((doc) => {
            candidatesData.push({ id: doc.id, ...doc.data() });
          });
          setCandidates(candidatesData);
          
          // Fetch voters data
          const votersCollectionRef = collection(firestore, 'Voters');
          const votersSnapshot = await getDocs(votersCollectionRef);
          const votersData = [];

          votersSnapshot.forEach((doc) => {
            votersData.push({ id: doc.id, ...doc.data() });
          });

          setVoters(votersData);
          console.log(votersData);
          

          // Fetch parties data
          const partiesCollectionRef = collection(firestore, 'party');
          const partiesSnapshot = await getDocs(partiesCollectionRef);
          const partiesData = [];

          partiesSnapshot.forEach((doc) => {
            partiesData.push({ id: doc.id, ...doc.data() });
          });
 
          setParties(partiesData);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }




        
      }
    });

    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  const startEditing = (candidateId) => {
    setIsEditing(candidateId);
    setEditedCandidate({ ...candidates.find((c) => c.id === candidateId) });
  };

  const handleSignOut = () => {
    console.log("User logged off");
  };
  const handleSaveEdit = async (e, candidateId) => {
    e.preventDefault();
  
    try {
      // Update the candidate data in Firestore
      const candidateDocRef = doc(firestore, 'candidates', candidateId);
      await updateDoc(candidateDocRef, {
        firstname: editedCandidate.firstname,
        lastname: editedCandidate.lastname,
        party: editedCandidate.party,
        constituency: editedCandidate.constituency,
        // Add other fields you want to update
      });
  
      // Update the local state with the edited data
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, ...editedCandidate } : candidate
        )
      );
  
      // Exit editing mode
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };
  

  // Form submission handlers

  const toggleAddPartyPopup = () => {
    setShowAddPartyPopup(!showAddPartyPopup);
  };

  const handleAddParty = (e) => {
    e.preventDefault();
    console.log('Party added:', newParty);
    setNewParty('');
    // Placeholder for success message
  };

  const handleDeleteParty = () => {
    // Placeholder for handling party deletion
    console.log(`Delete party with ID`);
    // Implement the logic to delete the party with the given ID
  };

  const handleEditParty = (partyId) => {
    // Placeholder for handling party modification
    console.log(`Modify party with ID ${partyId}`);
    // Implement the logic to modify the party with the given ID
  };

 

  const handleAddCandidate = async(e) => {
    e.preventDefault();
    try {
      // Add the new candidate to the candidates collection in Firestore
      const candidatesCollectionRef = collection(firestore, 'candidates'); // Change 'candidatesData' to your actual Firestore collection name
      const newCandidateDocRef = await addDoc(candidatesCollectionRef, {
        firstname: newCandidate.firstname,
        lastname: newCandidate.lastname,
        party: newCandidate.party,
        constituency: newCandidate.constituency,
        // Add other fields for a new candidate
      });

      // Retrieve the newly created candidate's ID
      const newCandidateId = newCandidateDocRef.id;

      // Update the local state with the new candidate
      setCandidates((prevCandidates) => [
        ...prevCandidates,
        {
          id: newCandidateId,
          ...newCandidate,
        },
      ]);

      // Reset the form and close the popup
      setNewCandidate({
        firstname: "",
        lastname: "",
        party: "",
        constituency: "",
        // Add other fields for a new candidate
      });
      setShowAddPopup(false);
    } catch (error) {
      console.error('Error adding candidate to Firestore:', error);
    }
  };


  const handleSetVotingDate = (date) => {
    setVotingDate(date);
    console.log('Voting date set to:', date);
    // Placeholder for success message
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    console.log('Notification sent:', notification);
    setNotification('');
    // Placeholder for success message
  };

  const handleDeleteVoter = (voterId) => {
    // Placeholder for handling voter deletion
    console.log(`Delete voter with ID ${voterId}`);
    // Implement the logic to delete the voter with the given ID
  };

  const handleApproveVoter = (voterId) => {
    // Placeholder for handling voter modification
    console.log(`Modify voter with ID ${voterId}`);
    // Implement the logic to modify the voter with the given ID
  };


  // Dummy data for the admin dashboard
  const totalVotersRegistered = '10,000';
  const totalVotesCasted = '5,000';
  const totalPartiesRegistered = '10';
  const totalCandidateRegistered = '25';

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <ul className="nav-links">
          <a href="#dashboard" onClick={() => setActiveSection('dashboard')}>Dashboard</a>
          <a href="#voters" onClick={() => setActiveSection('voters')}>Voters</a>
          <a href="#candidates" onClick={() => setActiveSection('candidates')}>Candidates</a>
          <a href="#parties" onClick={() => setActiveSection('parties')}>Parties</a>
         
        </ul>
      </nav>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleSignOut} className="logout-btn">Signout</button>
          </div>
        </header>

        <div className="dashboard-content">

          {activeSection === 'dashboard' && (
            <div>
              <div className="stats-section">
                <h2>Current Statistics</h2>
                <div className="box-container">
                  <div className="box">
                    <h3>Total Voters Registered</h3>
                    <p>{totalVotersRegistered}</p>
                  </div>
                  <div className="box">
                    <h3>Total Votes Casted</h3>
                    <p>{totalVotesCasted}</p>
                  </div>
                </div>
                <div className="box-container">
                  <div className="box">
                    <h3>Total Parties Registered</h3>
                    <p>{totalPartiesRegistered}</p>
                  </div>
                  <div className="box">
                    <h3>Total Candidates Registered</h3>
                    <p></p>
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h2>Set Voting Date and Time</h2>
                <DatePicker
                  selected={votingDate}
                  onChange={handleSetVotingDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
              <div className="form-section send-notification">
                <h2>Send Notification to Voters</h2>
                <form onSubmit={handleSendNotification}>
                  <textarea
                    placeholder="Notification Message"
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                  />
                  <button className='notification-button' type="submit">Send Notification</button>
                </form>
              </div>
            </div>
          )}
          

          {activeSection === 'parties' && (
            <div className="form-section">
              <h2>Parties</h2>
             
              {party.map((party) => (
                <div key={party.id} className="party-card">
                  <div>
                    {party.name} 
                  </div>
                  <div className="party-buttons">
                    <button className="edit-button" onClick={() => handleEditParty(party.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteParty(party.id)}>Delete</button>
                  </div>
                </div>
              ))}
              
              <button className="add-button" onClick={toggleAddPartyPopup}>Add more</button>
              {showAddPartyPopup && (
                <div className="party-popup">
                  <form onSubmit={handleAddParty}>
                    <input type="text" placeholder="Party Name" value={newParty} onChange={(e) => setNewParty(e.target.value)} />
                    <input type="text" placeholder="Party Abbreviation" /* ... */ />
                    <input type="text" placeholder="Party Leader" /* ... */ />
                    <input type="text" placeholder="Headquarters Address" /* ... */ />
                    <input type="email" placeholder="Contact Email" /* ... */ />
                    <textarea placeholder="Party Ideology" /* ... */ ></textarea>
                    <input type="date" placeholder="Established Date" /* ... */ />
                    <input type="file" /* ... */ />
                    <button type="submit">Add Party</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeSection === 'candidates' && (
            <div className="form-section">
              <h2>Candidates</h2>
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  {isEditing === candidate.id ? (
                    <div>
                      <img
                        src={candidate.imageURL}
                        alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
                        style={{ width: '100px', height: '100px', paddingLeft: '20px' }}
                      />
                      <form onSubmit={(e) => handleSaveEdit(e, candidate.id)}>
                        <label htmlFor={`editFirstname-${candidate.id}`}>First Name:</label>
                        <input
                          type="text"
                          id={`editFirstname-${candidate.id}`}
                          value={editedCandidate.firstname}
                          onChange={(e) => setEditedCandidate({ ...editedCandidate, firstname: e.target.value })}
                        />
          
                        <label htmlFor={`editLastname-${candidate.id}`}>Last Name:</label>
                        <input
                          type="text"
                          id={`editLastname-${candidate.id}`}
                          value={editedCandidate.lastname}
                          onChange={(e) => setEditedCandidate({ ...editedCandidate, lastname: e.target.value })}
                        />
                        <label htmlFor={`editParty-${candidate.id}`}>Party:</label>
                        <input
                          type="text"
                          id={`editParty-${candidate.id}`}
                          value={editedCandidate.party}
                          onChange={(e) => setEditedCandidate({ ...editedCandidate, party: e.target.value })}
                        />
                        <label htmlFor={`editConstituency-${candidate.id}`}>Constituency:</label>
                        <input
                          type="text"
                          id={`editConstituency-${candidate.id}`}
                          value={editedCandidate.constituency}
                          onChange={(e) => setEditedCandidate({ ...editedCandidate, constituency: e.target.value })}
                        />
                        <button type="submit">Save</button>
                        <button onClick={() => setIsEditing(null)}>Cancel</button>
                      </form>
                    
                    </div>
                  ) : (
                    <div>
                      <img
                        src={candidate.imageURL}
                        alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
                        style={{ width: '100px', height: '100px', paddingLeft: '20px' }}
                      />
                      {candidate.firstname} {candidate.lastname} - Party: {candidate.party}, Constituency: {candidate.constituency}
                      <button className="edit-button" onClick={() => startEditing(candidate.id)}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setShowAddPopup(true)}>Add Candidates</button>
            </div>
          )}
          
    {showAddPopup && (
      <div className="popup">
        <h3>Add New Candidate</h3>
        <form onSubmit={handleAddCandidate}>
          <label htmlFor="newFirstname">First Name:</label>
          <input
            type="text"
            id="newFirstname"
            value={newCandidate.firstname}
            onChange={(e) => setNewCandidate({ ...newCandidate, firstname: e.target.value })}
          />

          <label htmlFor="newLastname">Last Name:</label>
          <input
            type="text"
            id="newLastname"
            value={newCandidate.lastname}
            onChange={(e) => setNewCandidate({ ...newCandidate, lastname: e.target.value })}
          />

          <label htmlFor="newParty">Party:</label>
          <input
            type="text"
            id="newParty"
            value={newCandidate.party}
            onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
          />

          <label htmlFor="newConstituency">Constituency:</label>
          <input
            type="text"
            id="newConstituency"
            value={newCandidate.constituency}
            onChange={(e) => setNewCandidate({ ...newCandidate, constituency: e.target.value })}
          />
          <label htmlFor="newConstituency">Image:</label>
          <input
            type="text"
            id="newImage"
            value={newCandidate.imageURL}
            onChange={(e) => setNewCandidate({ ...newCandidate, imageURL: e.target.value })}
          />

          {/* Add other fields you want to add for a new candidate */}
          
          <button type="submit">Add Candidate</button>
          <button onClick={() => setShowAddPopup(false)}>Cancel</button>
        </form>
      </div>
    )}
          {activeSection === 'voters' && (
            <div className="form-section">
              <h2>Voters</h2>
              {voters.map((voter) => (
                <div key={voter.id} className="voter-card">
                  <div>
                  Gov ID: {voter.govID} - Voter ID: {voter.voterId}
                  </div>
                  <div className="voter-buttons">
                    <button className="edit-button" onClick={() => handleApproveVoter(voter.id)}>Approve</button>
                    <button className="delete-button" onClick={() => handleDeleteVoter(voter.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
