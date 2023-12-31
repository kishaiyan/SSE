import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import '../css/admin.css';

const Parties = () => {
  const [parties, setParties] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedParty, setEditedParty] = useState({});
  const [newParty, setNewParty] = useState({ name: '' });
  const [isAddingParty, setIsAddingParty] = useState(false);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const partiesCollectionRef = collection(firestore, 'party');
        const partiesSnapshot = await getDocs(partiesCollectionRef);

        const partiesData = [];
        partiesSnapshot.forEach((doc) => {
          partiesData.push({ id: doc.id, ...doc.data() });
        });

        setParties(partiesData);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchParties();
  }, []);

  const startEditingParty = (partyId) => {
    setIsEditing(partyId);
    setEditedParty({ ...parties.find((p) => p.id === partyId) });
  };

  const handleSaveEditParty = async (e, partyId) => {
    e.preventDefault();

    try {
      const partyDocRef = doc(firestore, 'party', partyId);
      await updateDoc(partyDocRef, {
        name: editedParty.name,
        // Add other fields you want to update
      });

      setParties((prevParties) =>
        prevParties.map((party) => (party.id === partyId ? { ...party, ...editedParty } : party))
      );

      setIsEditing(null);
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };

  const handleAddParty = async (e) => {
    e.preventDefault();

    try {
      const newPartyRef = await addDoc(collection(firestore, 'party'), newParty);
      const newPartyData = { id: newPartyRef.id, ...newParty };

      setParties((prevParties) => [...prevParties, newPartyData]);
      setNewParty({ name: '' });
      setIsAddingParty(false);
    } catch (error) {
      console.error('Error adding new party:', error);
    }
  };

  return (
    <div className="box-container-voter">
      <h2>Parties</h2>
      {parties.map((party) => (
        <div key={party.id} className="box-voter">
          {isEditing === party.id ? (
            <div>
              <form onSubmit={(e) => handleSaveEditParty(e, party.id)}>
                <label htmlFor={`editParty-${party.id}`}>Party:</label>
                <input
                  type="text"
                  id={`editParty-${party.id}`}
                  value={editedParty.name}
                  onChange={(e) => setEditedParty({ ...editedParty, name: e.target.value })}
                />

                <button type="submit">Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </form>
            </div>
          ) : (
            <div>
              Party Name: {party.name}
              <button onClick={() => startEditingParty(party.id)}>Edit</button>
            </div>
          )}
        </div>
      ))}
      {isAddingParty ? (
        <div className="box-voter">
          <form onSubmit={handleAddParty}>
            <label htmlFor="newPartyName">Party Name:</label>
            <input
              type="text"
              id="newPartyName"
              value={newParty.name}
              onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
            />

            <button type="submit">Add Party</button>
            <button onClick={() => setIsAddingParty(false)}>Cancel</button>
          </form>
        </div>
      ) : (
        <button className="add-party-button" onClick={() => setIsAddingParty(true)}>Add Party</button>
      )}
    </div>
  );
};

export default Parties;
