import { getWeather } from "./weatherAPI.js";

const citySelect = document.getElementById("city-select");
const weatherBox = document.getElementById("weather-box");

citySelect.addEventListener("change", async function () {

    const selectedValue = citySelect.value;

    const selectedCity =
        citySelect.options[citySelect.selectedIndex].text;

    if (selectedValue === "") {
        weatherBox.innerHTML =
            "<p>도시를 선택하면 날씨가 표시됩니다.</p>";
        return;
    }

    const [latitude, longitude] =
        selectedValue.split(",");

    weatherBox.innerHTML =
        "<p>실시간 날씨 로딩 중... ⏳</p>";

    try {

        const current =
            await getWeather(latitude, longitude);

        weatherBox.innerHTML = `
            <div class="weather-result">
                <h4>🌍 ${selectedCity}</h4>

                <p>
                    🌡️ 현재 기온 :
                    <strong>${current.temperature_2m}°C</strong>
                </p>

                <p>
                    💧 현재 습도 :
                    <strong>${current.relative_humidity_2m}%</strong>
                </p>
            </div>
        `;

    } catch (error) {

        weatherBox.innerHTML =
            "<p>⚠️ 날씨 정보를 가져오는 데 실패했습니다.</p>";

        console.error(error);
    }

});