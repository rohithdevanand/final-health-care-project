import React from "react";

const AddressInput = ({ address, setAddress, isRequired = true }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="address-group">
      <h4>Address</h4>
      <div>
        <label>Door Number</label>
        <input
          type="text"
          name="doorNumber"
          value={address.doorNumber}
          onChange={handleChange}
          required={isRequired}
        />
      </div>
      <div>
        <label>Main Address</label>
        <input
          type="text"
          name="mainAddress"
          value={address.mainAddress}
          onChange={handleChange}
          required={isRequired}
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
          required={isRequired}
        />
      </div>
      <div>
        <label>State</label>
        <input
          type="text"
          name="state"
          value={address.state}
          onChange={handleChange}
          required={isRequired}
        />
      </div>
      <div>
        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          value={address.pincode}
          onChange={handleChange}
          required={isRequired}
        />
      </div>
    </div>
  );
};

export default AddressInput;