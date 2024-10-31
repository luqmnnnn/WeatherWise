document.addEventListener("DOMContentLoaded", () => {
    const activitiesData = [
        {
            "category": "Hiking",
            "name": "Hiking",
            "locations": [
                { "name": "Denver", "image": "images/hiking.jpg" },
                { "name": "Aspen", "image": "images/hiking.jpg" },
                { "name": "Banff", "image": "images/hiking.jpg" },
                { "name": "Patagonia", "image": "images/hiking.jpg" }
            ],
            "equipment": ["Backpack", "Water bottle", "Hiking boots", "First-aid kit", "Trail map"]
        },
        {
            "category": "Paragliding",
            "name": "Paragliding",
            "locations": [
                { "name": "Interlaken", "image": "images/paragliding.jpg" },
                { "name": "Chamonix", "image": "images/paragliding.jpg" },
                { "name": "Cape Town", "image": "images/paragliding.jpg" },
                { "name": "Queenstown", "image": "images/paragliding.jpg" }
            ],
            "equipment": ["Paraglider", "Helmet", "Windsock", "Altimeter", "Reserve parachute"]
        },
        {
            "category": "Snowboarding",
            "name": "Snowboarding",
            "locations": [
                { "name": "Whistler", "image": "images/snowboarding.jpg" },
                { "name": "Zermatt", "image": "images/snowboarding.jpg" },
                { "name": "Niseko", "image": "images/snowboarding.jpg" },
                { "name": "Aspen", "image": "images/snowboarding.jpg" }
            ],
            "equipment": ["Snowboard", "Snow boots", "Helmet", "Goggles", "Warm gloves"]
        },
        {
            "category": "Snorkeling",
            "name": "Snorkeling",
            "locations": [
                { "name": "Bali", "image": "images/snorkeling.jpg" },
                { "name": "Great Barrier Reef", "image": "images/snorkeling.jpg" },
                { "name": "Maldives", "image": "images/snorkeling.jpg" },
                { "name": "Hawaii", "image": "images/snorkeling.jpg" }
            ],
            "equipment": ["Snorkel", "Mask", "Fins", "Wetsuit", "Reef-safe sunscreen"]
        }
    ];

    const activitySelect = document.getElementById("activity-select");
    const locationSelect = document.getElementById("location-select");
    const dateInput = document.getElementById("activity-date");
    const savedChecklistsContainer = document.getElementById("saved-checklists");

    activitiesData.forEach(activity => {
        const option = document.createElement("option");
        option.value = activity.category;
        option.text = activity.name;
        activitySelect.appendChild(option);
    });

    locationSelect.disabled = true;

    const displayEquipmentList = (equipment) => {
        const equipmentListElement = document.getElementById("equipment-list");
        equipmentListElement.innerHTML = "";

        equipment.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex align-items-center";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "mr-2";
            checkbox.addEventListener("change", () => {
                listItem.classList.toggle("completed", checkbox.checked);
            });

            const itemText = document.createElement("span");
            itemText.innerText = item;

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm ml-auto";
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", () => {
                equipment.splice(index, 1);
                displayEquipmentList(equipment);
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(itemText);
            listItem.appendChild(deleteButton);
            equipmentListElement.appendChild(listItem);
        });
    };

    document.getElementById("add-equipment-btn").addEventListener("click", () => {
        const newEquipmentInput = document.getElementById("new-equipment");
        const newEquipment = newEquipmentInput.value.trim();
        const selectedActivity = activitySelect.value;

        if (newEquipment && selectedActivity) {
            const activity = activitiesData.find(act => act.category === selectedActivity);
            activity.equipment.push(newEquipment);
            displayEquipmentList(activity.equipment);
            newEquipmentInput.value = "";
        }
    });

    const updateLocationDropdown = (activityCategory) => {
        locationSelect.innerHTML = "<option value=''>Select a location...</option>";

        const activity = activitiesData.find(activity => activity.category === activityCategory);
        activity.locations.forEach(location => {
            const option = document.createElement("option");
            option.value = location.name;
            option.text = location.name;
            locationSelect.appendChild(option);
        });

        locationSelect.disabled = false;
    };

    activitySelect.addEventListener("change", (event) => {
        const selectedActivity = event.target.value;
        if (selectedActivity) {
            updateLocationDropdown(selectedActivity);
        } else {
            locationSelect.disabled = true;
        }
    });

    locationSelect.addEventListener("change", (event) => {
        const selectedLocation = event.target.value;
        const selectedActivity = activitySelect.value;

        const activity = activitiesData.find(act => act.category === selectedActivity);
        if (activity) {
            const location = activity.locations.find(loc => loc.name === selectedLocation);
            if (location) {
                document.getElementById("activity-title").innerText = activity.name;
                document.getElementById("activity-location").innerText = location.name;
                document.getElementById("activity-image").src = location.image;
                displayEquipmentList(activity.equipment);
            }
        }
    });

    document.getElementById("save-data-btn").addEventListener("click", () => {
        const selectedDate = dateInput.value;
        const selectedActivity = activitySelect.value;
        const selectedLocation = locationSelect.value;
        
        const currentEquipmentItems = Array.from(document.querySelectorAll("#equipment-list li")).map(item => {
            return {
                name: item.querySelector("span").innerText,
                completed: item.querySelector("input[type='checkbox']").checked
            };
        });

        if (currentEquipmentItems.length > 0 && selectedActivity && selectedLocation && selectedDate) {
            const savedChecklistDiv = document.createElement("div");
            savedChecklistDiv.className = "saved-checklist p-3 mb-3 border rounded";
            savedChecklistDiv.style.fontSize = "1.2rem";  // Increase font size

            const activityLocationInfo = document.createElement("div");
            activityLocationInfo.className = "mb-2";
            activityLocationInfo.innerHTML = `
                <strong>Activity:</strong> ${selectedActivity} <br>
                <strong>Location:</strong> ${selectedLocation} <br>
                <strong>Date:</strong> ${selectedDate}
            `;
            savedChecklistDiv.appendChild(activityLocationInfo);

            currentEquipmentItems.forEach(equip => {
                const checklistItem = document.createElement("div");
                checklistItem.className = "d-flex align-items-center";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = equip.completed;
                checkbox.disabled = true;  // Disable initially
                checkbox.className = "mr-2";

                const itemText = document.createElement("span");
                itemText.innerText = equip.name;

                checklistItem.appendChild(checkbox);
                checklistItem.appendChild(itemText);
                savedChecklistDiv.appendChild(checklistItem);
            });

            const updateButton = document.createElement("button");
            updateButton.className = "btn btn-primary btn-sm mt-2";
            updateButton.innerText = "Update";
            savedChecklistDiv.appendChild(updateButton);

            updateButton.addEventListener("click", () => {
                Array.from(savedChecklistDiv.querySelectorAll("input[type='checkbox']")).forEach(checkbox => {
                    checkbox.disabled = !checkbox.disabled;
                });
                updateButton.innerText = updateButton.innerText === "Update" ? "Save" : "Update";
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm ml-2";
            deleteButton.innerText = "Delete Checklist";
            deleteButton.addEventListener("click", () => {
                savedChecklistsContainer.removeChild(savedChecklistDiv);
            });
            savedChecklistDiv.appendChild(deleteButton);

            savedChecklistsContainer.appendChild(savedChecklistDiv);
        } else {
            alert("Please select an activity, location, date, and at least one equipment item.");
        }
    });
});
