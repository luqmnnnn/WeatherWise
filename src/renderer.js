document.addEventListener("DOMContentLoaded", () => {
    // Time and day formatting functions
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDay = (date) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getDay()];
    };

    // Update displayed time and day
    const updateTimeAndDay = () => {
        document.querySelector("#current-time").innerHTML = formatTime(new Date());
        document.querySelector("#current-day").innerHTML = formatDay(new Date());
    };

    updateTimeAndDay();

    // Modal and element references
    const weatherModal = document.getElementById("weather-modal");
    const modalWeatherDetails = document.getElementById("modal-weather-details");
    const weatherDetails = document.getElementById("weather-details");
    const closeModal = document.querySelector(".close-btn");
    
    const weatherSearchInput = document.getElementById("weather-search-input");
    const weatherSearchButton = document.getElementById("weather-search-button");

    const hikingList = document.getElementById("hiking-list");
    const paraglidingList = document.getElementById("paragliding-list");
    const snowboardingList = document.getElementById("snowboarding-list");
    const snorkelingList = document.getElementById("snorkeling-list");

    // Activity data
    const activities = [
        { category: "Hiking", name: "Hiking", location: "Denver", image: "images/hiking.jpg" },
        { category: "Hiking", name: "Hiking", location: "Aspen", image: "images/hiking.jpg" },
        { category: "Hiking", name: "Hiking", location: "Banff", image: "images/hiking.jpg" },
        { category: "Hiking", name: "Hiking", location: "Patagonia", image: "images/hiking.jpg" },
        { category: "Paragliding", name: "Paragliding", location: "Interlaken", image: "images/paragliding.jpg" },
        { category: "Paragliding", name: "Paragliding", location: "Chamonix", image: "images/paragliding.jpg" },
        { category: "Paragliding", name: "Paragliding", location: "Cape Town", image: "images/paragliding.jpg" },
        { category: "Paragliding", name: "Paragliding", location: "Queenstown", image: "images/paragliding.jpg" },
        { category: "Snowboarding", name: "Snowboarding", location: "Whistler", image: "images/snowboarding.jpg" },
        { category: "Snowboarding", name: "Snowboarding", location: "Zermatt", image: "images/snowboarding.jpg" },
        { category: "Snowboarding", name: "Snowboarding", location: "Niseko", image: "images/snowboarding.jpg" },
        { category: "Snowboarding", name: "Snowboarding", location: "Aspen", image: "images/snowboarding.jpg" },
        { category: "Snorkeling", name: "Snorkeling", location: "Bali", image: "images/snorkeling.jpg" },
        { category: "Snorkeling", name: "Snorkeling", location: "Great Barrier Reef", image: "images/snorkeling.jpg" },
        { category: "Snorkeling", name: "Snorkeling", location: "Maldives", image: "images/snorkeling.jpg" },
        { category: "Snorkeling", name: "Snorkeling", location: "Hawaii", image: "images/snorkeling.jpg" }
    ];

    // Display activities by category
    const displayActivitiesByCategory = (activityList, categoryListElement, categoryName) => {
        categoryListElement.innerHTML = "";
    
        // Create a list for the activities
        const activityListElement = document.createElement("ul");
    
        activityList.forEach(activity => {
            const listItem = document.createElement("li");
            listItem.classList.add("activity-card");
    
            listItem.innerHTML = `
                <img src="${activity.image}" alt="${activity.name}" class="activity-image">
                <span>${activity.name} in ${activity.location}</span>
                <button class="btn btn-secondary check-weather-btn">Check Weather</button>
                <button class="btn btn-info see-details-btn">See Details</button>
            `;
    
            // Add event listener for the "Check Weather" button
            listItem.querySelector(".check-weather-btn").addEventListener("click", async () => {
                weatherDetails.innerHTML = "Loading weather data...";
                modalWeatherDetails.innerHTML = "Loading weather data...";
                const data = await fetchWeatherData(activity.location);
                if (data) {
                    displayWeatherData(data, activity.location, activity.category);
                } else {
                    const errorMessage = `<p class="error-message">Error fetching weather data. Please try again later.</p>`;
                    weatherDetails.innerHTML = errorMessage;
                    modalWeatherDetails.innerHTML = errorMessage;
                }
                weatherModal.style.display = "block"; // Open modal for weather details
            });
    
            // Add event listener for the "See Details" button
            listItem.querySelector(".see-details-btn").addEventListener("click", () => {
                const suitabilityMessage = getSuitabilityMessage(activity.category);
                modalWeatherDetails.innerHTML = `
                    <h3>Why This Activity is Suitable</h3>
                    <p>${suitabilityMessage}</p>
                `;
                weatherModal.style.display = "block"; // Open modal for suitability details
            });
    
            activityListElement.appendChild(listItem);
        });
    
        // Append the activities to the category list element
        categoryListElement.appendChild(activityListElement);
    
        // Create and append the "Suggested Equipment" button
        const suggestedEquipmentButton = document.createElement("button");
        suggestedEquipmentButton.classList.add("btn", "btn-warning", "suggested-equipment-btn");
        suggestedEquipmentButton.innerText = "Suggested Equipment";
    
        // Centering the button using a container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.textAlign = "center"; // Center the button
        buttonContainer.appendChild(suggestedEquipmentButton);
    
        // Add event listener for the "Suggested Equipment" button
        suggestedEquipmentButton.addEventListener("click", () => {
            const equipmentList = getSuggestedEquipment(categoryName);
            modalWeatherDetails.innerHTML = `
                <h3>Suggested Equipment for ${categoryName}</h3>
                <ul>${equipmentList.map(item => `<li>${item}</li>`).join('')}</ul>
            `;
            weatherModal.style.display = "block"; // Open modal for equipment list
        });
    
        categoryListElement.appendChild(buttonContainer); // Append the centered button container
    };
    
    // Function to get suggested equipment based on activity category
    const getSuggestedEquipment = (activityCategory) => {
        switch (activityCategory) {
            case "Hiking":
                return ["Backpack", "Water bottle", "Hiking boots", "First-aid kit", "Trail map"];
            case "Paragliding":
                return ["Paraglider", "Helmet", "Windsock", "Altimeter", "Reserve parachute"];
            case "Snowboarding":
                return ["Snowboard", "Snow boots", "Helmet", "Goggles", "Warm gloves"];
            case "Snorkeling":
                return ["Snorkel", "Mask", "Fins", "Wetsuit", "Reef-safe sunscreen"];
            default:
                return ["Standard outdoor equipment"];
        }
    };
    
    // Call displayActivitiesByCategory for each category
    displayActivitiesByCategory(activities.filter(act => act.category === "Hiking"), hikingList, "Hiking");
    displayActivitiesByCategory(activities.filter(act => act.category === "Paragliding"), paraglidingList, "Paragliding");
    displayActivitiesByCategory(activities.filter(act => act.category === "Snowboarding"), snowboardingList, "Snowboarding");
    displayActivitiesByCategory(activities.filter(act => act.category === "Snorkeling"), snorkelingList, "Snorkeling");
    
    // Close modal functionality
    closeModal.onclick = () => (weatherModal.style.display = "none");
    window.onclick = (event) => {
        if (event.target === weatherModal) {
            weatherModal.style.display = "none";
        }
    };
    
    // Fetch weather data from API
    const fetchWeatherData = async (location) => {
        const apiKey = '2502fc82d2ad4079ae3182103242710';
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch weather data");
            return await response.json();
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    };
    
    // Display weather data
    const displayWeatherData = (data, location, category) => {
        const { current, forecast, location: locData } = data;
        
        const weatherContent = `
            <div class="weather-card">
                <h3>Weather in ${locData.name}, ${locData.region}, ${locData.country}</h3>
                <p><strong>Local Time:</strong> ${locData.localtime}</p>
                <p><strong>Current Temperature:</strong> ${current.temp_c}°C</p>
                <p><strong>Condition:</strong> ${current.condition.text}</p>
                <p><strong>Humidity:</strong> ${current.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${current.wind_kph} kph</p>
                <h4>Forecast</h4>
                <p><strong>Forecast Max Temperature:</strong> ${forecast.forecastday[0].day.maxtemp_c}°C</p>
                <p><strong>Forecast Min Temperature:</strong> ${forecast.forecastday[0].day.mintemp_c}°C</p>
                <p><strong>Chance of Snow:</strong> ${forecast.forecastday[0].day.daily_chance_of_snow}%</p>
                <p><strong>Chance of Rain:</strong> ${forecast.forecastday[0].day.daily_chance_of_rain}%</p>
            </div>
        `;
    
        // Display the weather content
        weatherDetails.innerHTML = weatherContent;
        modalWeatherDetails.innerHTML = weatherContent;
    };
    
    // Get detailed suitability message based on activity    const getSuitabilityMessage = (activityCategory) => {
        const getSuitabilityMessage = (activityCategory) => {
            switch (activityCategory) {
                case "Hiking":
                    return `Hiking is an exhilarating activity that allows you to explore nature while enjoying fresh air and beautiful landscapes. The best weather for hiking is typically clear and sunny, with temperatures that are comfortable for prolonged outdoor activity.
    
                    In sunny conditions, hikers can enjoy stunning views and vibrant wildlife. However, it's crucial to stay hydrated, use sunscreen, and wear appropriate clothing to protect against the sun's rays. If the weather turns cloudy but remains dry, it can still be a great time for a hike as the cooler temperatures prevent overheating.
    
                    On rainy days, it's essential to choose well-marked trails that are not prone to flooding. Ensure that you have appropriate footwear to handle slippery conditions. Always check local weather forecasts before your hike to prepare for any changes.`;
    
                case "Paragliding":
                    return `Paragliding offers an incredible perspective of the landscape and is best enjoyed in calm, clear conditions. Ideal weather is characterized by light winds and sunny skies, which allow for safe and enjoyable flights. When the weather is favorable, paragliders can soar high above the ground, taking in breathtaking views.
    
                    Overcast conditions can still be acceptable, provided wind speeds are manageable. Pilots should always prioritize safety and avoid flying in strong winds, as they can lead to unpredictable conditions. A clear, calm day not only enhances safety but also offers an unforgettable experience.
    
                    Always keep an eye on local weather updates and listen to the guidance of experienced pilots to ensure the best conditions for your flight.`;
    
                case "Snowboarding":
                    return `Snowboarding is a thrilling winter sport that is most enjoyable in cold, snowy conditions. Fresh powder is perfect for an exciting ride, allowing snowboarders to carve through the snow smoothly. The ideal temperature for snowboarding usually ranges from -5°C to -10°C, providing a great balance of comfort and performance.
    
                    Clear, sunny days on the slopes can make for a fantastic experience, enhancing visibility and allowing snowboarders to enjoy the beautiful surroundings. However, be cautious of overly sunny days as they can lead to melting snow, affecting conditions.
    
                    Overcast days can still be suitable if there is good snow coverage. Always check the local weather and slope conditions to ensure safety. Wearing appropriate gear is crucial to stay warm and dry throughout the day.`;
    
                case "Snorkeling":
                    return `Snorkeling is best enjoyed in warm, calm waters with good visibility. The ideal weather conditions include sunny days that offer clear water, allowing you to observe vibrant marine life beneath the surface. Always check local weather reports before planning your snorkeling excursion.
    
                    If there are waves or high winds, it's advisable to postpone your trip to ensure safety. Also, make sure to use reef-safe sunscreen to protect marine ecosystems. Calm conditions not only enhance visibility but also provide a more enjoyable experience.
    
                    Even slightly cloudy days can be acceptable for snorkeling, as long as the wind is calm and the water conditions are safe. Remember to be aware of tides and currents, and always snorkel with a buddy for added safety.`;
    
                default:
                    return "Detailed suitability information is not available for this activity.";
            }
        };

    // Implement the search function
    weatherSearchButton.addEventListener("click", async () => {
        const location = weatherSearchInput.value.trim();
        if (location) {
            weatherDetails.innerHTML = "Loading weather data...";
            modalWeatherDetails.innerHTML = "Loading weather data...";
            const data = await fetchWeatherData(location);
            if (data) {
                displayWeatherData(data, location);
            } else {
                const errorMessage = `<p class="error-message">Error fetching weather data. Please try again later.</p>`;
                weatherDetails.innerHTML = errorMessage;
                modalWeatherDetails.innerHTML = errorMessage;
            }
            weatherModal.style.display = "block"; // Open modal for weather details
        } else {
            alert("Please enter a location.");
        }
    });
});
