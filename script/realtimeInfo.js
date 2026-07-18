import {
    getWeather,
    searchCity
} from "./weatherAPI.js";


// HTML 요소 가져오기
const citySelect = document.getElementById("city-select");
const weatherBox = document.getElementById("weather-box");

const citySearchArea =
    document.getElementById("city-search-area");

const cityInput =
    document.getElementById("city-input");

const citySearchButton =
    document.getElementById("city-search-button");

const citySearchResults =
    document.getElementById("city-search-results");


/**
 * Open-Meteo의 날씨 코드를
 * 이모지로 변환하는 함수
 *
 * @param {number} weatherCode 날씨 코드
 * @returns {string} 날씨 이모지
 */
function getWeatherEmoji(weatherCode) {
    if (weatherCode === 0) {
        return "☀️";
    }

    if (weatherCode >= 1 && weatherCode <= 3) {
        return "⛅";
    }

    if (weatherCode === 45 || weatherCode === 48) {
        return "🌫️";
    }

    if (weatherCode >= 51 && weatherCode <= 67) {
        return "🌧️";
    }

    if (weatherCode >= 71 && weatherCode <= 77) {
        return "🌨️";
    }

    if (weatherCode >= 80 && weatherCode <= 82) {
        return "🌦️";
    }

    if (weatherCode >= 95) {
        return "⛈️";
    }

    return "🌤️";
}


/**
 * 선택한 도시의 날씨를 가져와
 * weatherBox에 표시하는 함수
 *
 * @param {string} cityName 화면에 표시할 도시 이름
 * @param {number|string} latitude 위도
 * @param {number|string} longitude 경도
 */
async function displayWeather(
    cityName,
    latitude,
    longitude
) {
    weatherBox.innerHTML = `
        <p>
            ${cityName}의 실시간 날씨를
            불러오는 중입니다... ⏳
        </p>
    `;

    try {
        const weatherData = await getWeather(
            latitude,
            longitude
        );

        const current = weatherData.current;
        const units = weatherData.units;

        const weatherEmoji =
            getWeatherEmoji(current.weather_code);

        weatherBox.innerHTML = `
            <div class="weather-result">
                <h4>
                    ${weatherEmoji} ${cityName}
                </h4>

                <p>
                    🌡️ 현재 기온:
                    <strong>
                        ${current.temperature_2m}
                        ${units.temperature_2m}
                    </strong>
                </p>

                <p>
                    😊 체감 온도:
                    <strong>
                        ${current.apparent_temperature}
                        ${units.apparent_temperature}
                    </strong>
                </p>

                <p>
                    💧 현재 습도:
                    <strong>
                        ${current.relative_humidity_2m}
                        ${units.relative_humidity_2m}
                    </strong>
                </p>

                <p>
                    💨 풍속:
                    <strong>
                        ${current.wind_speed_10m}
                        ${units.wind_speed_10m}
                    </strong>
                </p>
            </div>
        `;
    } catch (error) {
        weatherBox.innerHTML = `
            <p class="error-message">
                ⚠️ 날씨 정보를 가져오는 데 실패했습니다.
            </p>
        `;

        console.error(error);
    }
}


/**
 * select의 도시 선택값이 변경됐을 때 실행
 */
citySelect.addEventListener(
    "change",
    async function () {
        const selectedValue = citySelect.value;

        // 아무 도시도 선택하지 않은 경우
        if (selectedValue === "") {
            citySearchArea.hidden = true;

            weatherBox.innerHTML = `
                <p>
                    도시를 선택하면 날씨가 표시됩니다.
                </p>
            `;

            return;
        }

        // 직접 추가를 선택한 경우
        if (selectedValue === "custom") {
            citySearchArea.hidden = false;

            cityInput.focus();

            weatherBox.innerHTML = `
                <p>
                    검색할 도시 이름을 입력해 주세요.
                </p>
            `;

            return;
        }

        // 기존 도시 또는 추가된 도시를 선택한 경우
        citySearchArea.hidden = true;

        const selectedCity =
            citySelect.options[
                citySelect.selectedIndex
            ].text;

        const [latitude, longitude] =
            selectedValue.split(",");

        await displayWeather(
            selectedCity,
            latitude,
            longitude
        );
    }
);


/**
 * 사용자가 입력한 도시를 검색하는 함수
 */
async function handleCitySearch() {
    const cityName = cityInput.value.trim();

    // 입력값이 없는 경우
    if (cityName === "") {
        citySearchResults.innerHTML = `
            <p class="error-message">
                도시 이름을 입력해 주세요.
            </p>
        `;

        cityInput.focus();

        return;
    }

    citySearchResults.innerHTML = `
        <p>도시 검색 중... 🔍</p>
    `;

    try {
        const cities = await searchCity(cityName);

        // 검색 결과가 없는 경우
        if (cities.length === 0) {
            citySearchResults.innerHTML = `
                <p class="error-message">
                    검색 결과가 없습니다.
                </p>
            `;

            return;
        }

        displayCitySearchResults(cities);
    } catch (error) {
        citySearchResults.innerHTML = `
            <p class="error-message">
                ⚠️ 도시 검색에 실패했습니다.
            </p>
        `;

        console.error(error);
    }
}


/**
 * 도시 검색 결과를 버튼 목록으로 표시하는 함수
 *
 * @param {Array} cities 검색된 도시 배열
 */
function displayCitySearchResults(cities) {
    citySearchResults.innerHTML = "";

    const resultList =
        document.createElement("ul");

    resultList.className = "city-result-list";

    cities.forEach(function (city) {
        const resultItem =
            document.createElement("li");

        const resultButton =
            document.createElement("button");

        resultButton.type = "button";
        resultButton.className =
            "city-result-button";

        const cityName = city.name;
        const adminName = city.admin1 ?? "";
        const countryName = city.country ?? "";

        resultButton.textContent =
            `${cityName} ${adminName} ${countryName}`;

        resultButton.addEventListener(
            "click",
            function () {
                addCityToSelect(city);
            }
        );

        resultItem.appendChild(resultButton);
        resultList.appendChild(resultItem);
    });

    citySearchResults.appendChild(resultList);
}


/**
 * 검색 결과에서 선택한 도시를
 * select 목록에 추가하는 함수
 *
 * @param {Object} city 선택한 도시 객체
 */
function addCityToSelect(city) {
    const cityValue =
        `${city.latitude},${city.longitude}`;

    const cityText = city.country
        ? `${city.name}, ${city.country}`
        : city.name;

    // 이미 같은 좌표의 도시가 있는지 검사
    const existingOption =
        Array.from(citySelect.options).find(
            function (option) {
                return option.value === cityValue;
            }
        );

    if (existingOption) {
        // 이미 존재하면 기존 option 선택
        citySelect.value = existingOption.value;
    } else {
        // 존재하지 않으면 새로운 option 생성
        const newOption =
            document.createElement("option");

        newOption.value = cityValue;
        newOption.textContent = cityText;

        // 직접 추가 option 찾기
        const customOption =
            citySelect.querySelector(
                'option[value="custom"]'
            );

        // 직접 추가 바로 앞에 새 도시 삽입
        citySelect.insertBefore(
            newOption,
            customOption
        );

        // 새로 추가한 도시 선택
        citySelect.value = cityValue;
    }

    // 검색 영역 초기화
    citySearchArea.hidden = true;
    cityInput.value = "";
    citySearchResults.innerHTML = "";

    // 선택한 도시의 날씨 표시
    displayWeather(
        cityText,
        city.latitude,
        city.longitude
    );
}


// 검색 버튼 클릭 시 도시 검색
citySearchButton.addEventListener(
    "click",
    handleCitySearch
);


// 검색창에서 Enter 키를 누르면 도시 검색
cityInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            handleCitySearch();
        }
    }
);