import React, { useState } from "react";
import "./Modal.css";
import axios from "axios";

function Modal({ onClose }) {
  const [segmentName, setSegmentName] = useState("");
  const [dropdowns, setDropdowns] = useState([]); // Tracks the selected options for each dropdown
  const [availableOptions, setAvailableOptions] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);
  const [selectedOption, setSelectedOption] = useState(""); // The option selected from the "Add schema to segment" dropdown

  // Handle adding a new schema (dropdown) to the blue box
  const handleAddSchema = () => {
    if (!selectedOption) {
      alert("Please select an option to add.");
      return;
    }

    const selected = availableOptions.find(
      (opt) => opt.value === selectedOption
    );

    // Add selected schema to the blue box
    setDropdowns((prevDropdowns) => [...prevDropdowns, { ...selected }]);

    // Remove selected option from available options
    setAvailableOptions((prevOptions) =>
      prevOptions.filter((opt) => opt.value !== selectedOption)
    );

    // Reset the selected option in the "Add schema to segment" dropdown
    setSelectedOption("");
  };

  // Handle changing the value of an existing dropdown in the blue box
  const handleDropdownChange = (index, newValue) => {
    const updatedDropdowns = [...dropdowns];
    const selectedOption = availableOptions.find(
      (opt) => opt.value === newValue
    );
    if (selectedOption) {
      updatedDropdowns[index] = selectedOption;
      setDropdowns(updatedDropdowns);
    }
  };

  // Handle removing a dropdown from the blue box
  const handleRemoveDropdown = (index) => {
    const dropdownToRemove = dropdowns[index];
    setDropdowns((prevDropdowns) =>
      prevDropdowns.filter((_, i) => i !== index)
    ); // Remove the dropdown
    setAvailableOptions((prevOptions) => [...prevOptions, dropdownToRemove]);
  };

  // Get available options that haven't been selected yet
  const getAvailableOptions = () => {
    const selectedValues = dropdowns.map((dropdown) => dropdown.value);
    return availableOptions.filter(
      (option) => !selectedValues.includes(option.value)
    );
  };

  const handleSaveSegment = () => {
    if (!segmentName) {
      alert("Segment name is required.");
      return;
    }

    if (dropdowns.length === 0) {
      alert("At least one schema should be selected.");
      return;
    }


    const schema = dropdowns.map((dropdown) => ({
      [dropdown.value]: dropdown.label,
    }));

    const data = {
      segment_name: segmentName,
      schema,
    };

    console.log(schema);
    console.log(data);

    const saveData = async () => {
      try {
        const response = await axios.post(
          "https://webhook.site/9ea95e19-9b66-41a1-b647-cbe503f89849", // Relative path
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", // Example of changing content type
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error saving segment:", error);
      }
    };

    saveData();

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="top-nav1">
          <button className="back-button" onClick={onClose}>
            &lt;
          </button>
          <h2>Save Segment</h2>
        </div>

        {/* Segment Name */}
        <label id="segment-label">Enter the Name of the Segment:</label>
        <input
          type="text"
          value={segmentName}
          placeholder="Name of the Segment "
          onChange={(e) => setSegmentName(e.target.value)}
          className="segment-name"
          required
        />
        <p>
          To save your segment,you need to add the schemas to build the query
        </p>
        {/* Blue Box */}
        <div className="blue-box">
          {dropdowns.map((dropdown, index) => (
            <div className="dropdown-row" key={index}>
              <select
                value={dropdown.value} // Bind each dropdown value correctly
                onChange={(e) => handleDropdownChange(index, e.target.value)}
              >
                <option>{dropdown.value}</option>
                {getAvailableOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="remove-button"
                onClick={() => handleRemoveDropdown(index)}
              >
                ___
              </button>
            </div>
          ))}
        </div>

        {/* Add Schema Section */}
        <div className="add-schema-container">
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Add schema to segment:</option>
            {getAvailableOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="add-schema" onClick={handleAddSchema}>
            + Add new schema
          </button>
        </div>

        <div className="segment-buttons-container">
          <button className="save-button" onClick={handleSaveSegment}>
            Save Segment
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
