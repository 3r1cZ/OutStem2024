import { useState } from "react";

interface Props {
  dropdownTitles: string[];
}

const Dropdown = ({ dropdownTitles }: Props) => {
  const [selectedOption, setSelectedOption] = useState("Default");

  // function to set the selected option
  const handleSelect = (text: any) => {
    setSelectedOption(text);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedOption}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {dropdownTitles.map((dropdownTitle, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              onClick={() => handleSelect(dropdownTitle)}
            >
              {dropdownTitle}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
