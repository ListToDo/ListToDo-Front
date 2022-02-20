import React from "react";
import SelectMenu from "components/UI/SelectMenu";

const SelectColor = ({taskColor, setTaskColor}) => {

    const selectMenuOptions = [
        {
            iconClass: "far fa-circle",
            text: "No Color",
            value: null,
            iconColor: "var(--color-icon)"
        },
        {
            iconClass: "fa fa-circle",
            text: "Color 1",
            value: 1,
            iconColor: "var(--color-priority-1)"
        },
        {
            iconClass: "fa fa-circle",
            text: "Color 2",
            value: 2,
            iconColor: "var(--color-priority-2)"
        },
        {
            iconClass: "fa fa-circle",
            text: "Color 3",
            value: 3,
            iconColor: "var(--color-priority-3)"
        },
        {
            iconClass: "fa fa-circle",
            text: "Color 4",
            value: 4,
            iconColor: "var(--color-priority-4)"
        },
        {
            iconClass: "fa fa-circle",
            text: "Color 5",
            value: 5,
            iconColor: "var(--color-priority-5)"
        },
    ];

    return (
        <SelectMenu
            options={selectMenuOptions}
            type="selectable-options"
            customButtonIcon="far fa-palette"
            buttonSize="22px"
            activeOption={taskColor}
            setActiveOption={setTaskColor}
            customButtonIconColor={`var(${taskColor ? `--color-priority-${taskColor}` : "--color-icon"})`}
        />
    );
};

export default SelectColor;
