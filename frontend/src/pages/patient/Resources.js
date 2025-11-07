import React from "react";

// Hardcoded data as requested
const bloodBanks = [
  {
    name: "Karnataka Red Cross Blood Bank",
    address: "Race Course Road, Bengaluru, Karnataka 560001",
  },
  {
    name: "TTK Blood Bank",
    address: "Bannerghatta Road, Bilekahalli, Bengaluru, Karnataka 560076",
  },
  {
    name: "Victoria Hospital Blood Bank",
    address: "Fort Road, KR Market, Bengaluru, Karnataka 560002",
  },
];

const oxygenCylinders = [
  {
    name: "Bhartia Industries",
    address: "Peenya Industrial Area, Bengaluru, Karnataka 560058",
  },
  {
    name: "Bangalore Oxygen Suppliers",
    address: "Nagarathpet, Bengaluru, Karnataka 560002",
  },
  {
    name: "MediGas",
    address: "Yeshwanthpur, Bengaluru, Karnataka 560022",
  },
];

const ResourceItem = ({ item }) => (
  <div style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem' }}>
    <h4>{item.name}</h4>
    <p>{item.address}</p>
  </div>
);

const Resources = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Blood Banks (Karnataka)</h2>
        {bloodBanks.map((item, index) => (
          <ResourceItem key={index} item={item} />
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <h2>Oxygen Cylinders (Karnataka)</h2>
        {oxygenCylinders.map((item, index) => (
          <ResourceItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Resources;