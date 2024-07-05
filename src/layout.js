import './layout.css';
import Megapack from './images/Tesla_Megapack.webp.png';

// const batteryImages = {
//   'Megapack 2XL': Megapack,
//   'Megapack 2': Megapack,
//   'Megapack': Megapack,
//   'Powerpack': Megapack,
//   'Transformer': Megapack,
// };


const Layout = ({ layoutData }) => {

    const batteryColors = {
        'Megapack 2XL': '#ff7f50',  // Coral
        'Megapack 2': '#ff6347',    // Tomato
        'Megapack': '#4682b4',      // SteelBlue
        'Powerpack': '#32cd32',     // LimeGreen
        'Transformer': '#6a5acd'    // SlateBlue
    };

  return (
    <div className="land">
      {layoutData.map((item, index) => (
        <div
          key={index}
          style={{
            width: `${item.dimension}px`, 
            height: '50px', // Fixed height for simplicity
            backgroundColor: batteryColors[item.name],
            border: '1px solid black',
            display: 'inline-block',
            margin: '2px'
          }}
          title={`${item.name}`}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default Layout
