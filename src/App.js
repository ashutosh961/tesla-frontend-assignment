import Layout from './layout'; 
import React, { useState, useEffect } from 'react';
import Modal from './modal';

function App() {
  const [inputs, setInputs] = useState({
    'Megapack 2XL': 0,
    'Megapack 2': 0,
    'Megapack': 0,
    'Powerpack': 0
  });
  const [results, setResults] = useState({
    totalCost: 0,
    totalEnergy: 0,
    landSize: 0,
    layout: ''
  });

  const batterySpecs = {
    'Megapack 2XL': { length: 40, width: 10, energy: 4, cost: 120000 },
    'Megapack 2': { length: 30, width: 10, energy: 3, cost: 80000 },
    'Megapack': { length: 30, width: 10, energy: 2, cost: 50000 },
    'Powerpack': { length: 10, width: 10, energy: 1, cost: 20000 },
    'Transformer': { length: 10, width: 10, energy: -0.25, cost: 10000 }
  };
   const [layoutData, setLayoutData] = useState([]);
   const [isModalOpen, setModalOpen] = useState(false);
   const [isFull, setIsFull] = useState(false);  // Track whether the space is full
   const [lastUpdated, setLastUpdated] = useState(null);  

    const handleChange = (e) => {
        if (!isFull || e.value < inputs[e.name]) {  // Only allow changes if there is space
          const {name, value} = e.target;  
          setInputs(prev => ({ ...prev, [name]: Number(value) }));
        }
    };

   const updateLayoutData = () => {
    let newLayoutData = [];
    const landWidth = 400;
    const landHeight = 400;
    let usedArea = 0;
    let totalUnits = 0;
    let spaceAvailable = true

       // Count total batteries
       Object.keys(inputs).forEach(key => {
           totalUnits += inputs[key];
       });

      // Calculate transformers based on total batteries
     const transformerCount = Math.floor(totalUnits / 4);
     totalUnits += transformerCount; // Include transformers in total unit count

     // Calculate the width and height for each unit to fit within 400x400 px area
     const rows = Math.ceil(Math.sqrt(totalUnits)); // Calculate the number of rows needed to fit all units
     const unitSize = 400 / rows; // Equal width and height for each unit

    // Function to calculate remaining area
    const canAddBattery = (width, height) => {
        return ((width * height) + usedArea) <= (landWidth * landHeight);
    };

    // Add batteries if they fit
    Object.keys(inputs).forEach(key => {
        const battery = batterySpecs[key];
        const count = inputs[key];
        for (let i = 0; i < count; i++) {
            if (canAddBattery(battery.width, battery.length)) {
                newLayoutData.push({
                    name: key,
                    width: battery.width,
                    height: battery.length,
                });
                usedArea += (battery.width * battery.length) * 27; 
                console.log("TotalArea:" +landHeight*landWidth)
                console.log("UsedArea:" + usedArea) // Update used area
            } else {
                // Optionally handle the case where there's no room for more batteries
                console.log(`Not enough space to add more ${key}`);
                spaceAvailable = false;
                setModalOpen(true);
                setIsFull(true);
                setLastUpdated(key);  // Open modal when there's no space
                break;  // Stop trying to add more of this type
            }
        }
    });

    // Add transformers to the layout data
     for (let i = 0; i < transformerCount; i++) {
         newLayoutData.push({
             name: 'Transformer',
             width: unitSize,
             height: unitSize
         });
     }

    setLayoutData(newLayoutData);
};

  useEffect(() => {
    // Calculate layout whenever inputs change
    updateLayoutData();
  }, [inputs]);


  const calculateResults = () => {
    let totalCost = 0;
    let totalEnergy = 0;
    let totalBatteries = 0;
    let dimensions = [];

    // Calculate total for batteries
    for (const [key, count] of Object.entries(inputs)) {
      if (batterySpecs[key]) {
        totalCost += batterySpecs[key].cost * count;
        totalEnergy += batterySpecs[key].energy * count;
        totalBatteries += count;
        dimensions.push((batterySpecs[key].length * batterySpecs[key].width) / 10 * count);
      }
    }

    // Calculate transformers
    const transformerCount = Math.floor(totalBatteries / 4);
    totalCost += batterySpecs['Transformer'].cost * transformerCount;
    totalEnergy += batterySpecs['Transformer'].energy * transformerCount;
    dimensions.push((batterySpecs['Transformer'].length * batterySpecs['Transformer'].width) / 10 * transformerCount);
  

    // Layout logic
    const layout = `Total width: ${dimensions.reduce((acc, val) => acc + val, 0)}ft`;

    setResults({
      totalCost,
      totalEnergy,
      landSize: dimensions.reduce((acc, val) => acc + val, 0) * 10,  // Simplified land size
      layout
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (lastUpdated && inputs[lastUpdated] > 0) {
        setInputs(prev => ({
            ...prev,
            [lastUpdated]: prev[lastUpdated] - 1  // Decrement the last updated battery count by one
        }));
    }
    setIsFull(false);  // Reset the full status to allow further inputs
};



  return (
    <div className="App">
      <h1>Battery Layout Calculator</h1>
      {Object.keys(inputs).map(key => (
        <div key={key}>
          <label>{key}: </label>
          <input
            type="number"
            name={key}
            value={inputs[key]}
            onChange={handleChange}
            min="0"
            disabled={isFull}  
          />
        </div>
      ))}
      <button onClick={calculateResults}>Calculate</button>
      <div>
        <h2>Results</h2>
        <p>Total Cost: ${results.totalCost}</p>
        <p>Total Energy Output: {results.totalEnergy} MWh</p>
        <p>Required Land Size: {results.landSize} sqft</p>
      </div>
      <Layout layoutData={layoutData} />
      <Modal isOpen={isModalOpen} onClose={() => {handleCloseModal();}}>
                <p>You cannot add more batteries as there is no more space available.</p>
            </Modal>
    </div>

  );
}

export default App;
