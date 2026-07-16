// HTML에서 도시 선택창과 날씨 출력 영역 가져오기
const citySelect = document.getElementById("city-select");
const weatherBox = document.getElementById("weather-box");

// 도시 선택값이 바뀌면 실행
citySelect.addEventListener("change", async function () {
    // 사용자가 선택한 option의 value 가져오기
    const selectedValue = citySelect.value;

    // 사용자가 선택한 도시 이름 가져오기
    const selectedCity =
        citySelect.options[citySelect.selectedIndex].text;

    // 도시를 선택하지 않은 경우
    if (selectedValue === "") {
        weatherBox.innerHTML = `
            <p>도시를 선택하면 날씨가 표시됩니다.</p>
        `;
        return;
    }

    // "37.56,126.97"을 쉼표 기준으로 나누기
    const coordinates = selectedValue.split(",");

    // 배열에서 위도와 경도 꺼내기
    const latitude = coordinates[0];
    const longitude = coordinates[1];

    // 서버에서 데이터를 가져오는 동안 로딩 메시지 표시
    weatherBox.innerHTML = `
        <p>실시간 날씨 로딩 중... ⏳</p>
    `;

    try {
        // Open-Meteo API 주소 만들기
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m`;

        // Open-Meteo 서버에 날씨 데이터 요청
        const response = await fetch(url);

        // 서버 응답에 문제가 있는 경우 오류 발생
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        // 서버가 보낸 JSON 데이터를 JavaScript 객체로 변환
        const data = await response.json();

        // 현재 기온과 현재 습도 꺼내기
        const currentTemp = data.current.temperature_2m;
        const currentHumidity =
            data.current.relative_humidity_2m;

        // 화면에 실시간 날씨 출력
        weatherBox.innerHTML = `
            <div class="weather-result">
                <h4>🌍 ${selectedCity} 실시간 날씨</h4>

                <p>
                    🌡️ 현재 기온:
                    <strong>${currentTemp}°C</strong>
                </p>

                <p>
                    💧 현재 습도:
                    <strong>${currentHumidity}%</strong>
                </p>
            </div>
        `;
    } catch (error) {
        // 인터넷 연결 또는 서버 요청에 실패한 경우
        weatherBox.innerHTML = `
            <p>⚠️ 날씨 정보를 가져오는 데 실패했습니다.</p>
        `;

        // 개발자 도구 콘솔에 오류 내용 출력
        console.error(error);
    }
});