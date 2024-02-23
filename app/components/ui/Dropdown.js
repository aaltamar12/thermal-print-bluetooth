import { useState, useMemo, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function CustomDropdown({
  options,
  onSelectValue,
  labelButton,
  ariaLabel,
  width,
  height,
  className,
}) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedName, setSelectedName] = useState("");

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleDropdown = (value) => {
    setSelectedKeys(value);
    const optionSelected = options.find((e) => e.value === value.currentKey);
    setSelectedName(optionSelected.name);
  };

  useEffect(() => {
    onSelectValue && onSelectValue(selectedValue);
  }, [selectedValue]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className={`capitalize  ${width || "w-full"} ${height}`}
        >
          {selectedName || labelButton}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={ariaLabel || "Dropdown"}
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleDropdown}
      >
        {options.map((e) => {
          return <DropdownItem key={e.value}>{e.name}</DropdownItem>;
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
