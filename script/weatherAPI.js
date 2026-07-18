/**
 * 도시 이름을 검색하여 위치 정보를 가져오는 함수
 *
 * @param {string} cityName 검색할 도시 이름
 * @returns {Promise<Array>} 검색된 도시 정보 배열
 */
export async function searchCity(cityName) {
    // 사용자가 입력한 도시 이름을 URL에서 안전하게 사용할 수 있도록 변환
    const encodedCityName = encodeURIComponent(cityName);

    // Open-Meteo 지오코딩 API 주소
    const url =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodedCityName}` +
        `&count=5` +
        `&language=ko` +
        `&format=json`;

    // API에 요청 보내기
    const response = await fetch(url);

    // 요청에 실패한 경우 오류 발생
    if (!response.ok) {
        throw new Error("도시 검색 데이터를 가져오지 못했습니다.");
    }

    // JSON 데이터를 JavaScript 객체로 변환
    const data = await response.json();

    // 검색 결과가 있으면 results 배열 반환
    // 검색 결과가 없으면 빈 배열 반환
    return data.results ?? [];
}


/**
 * 위도와 경도를 이용하여 현재 날씨를 가져오는 함수
 *
 * @param {number|string} latitude 위도
 * @param {number|string} longitude 경도
 * @returns {Promise<Object>} 현재 날씨 정보
 */
export async function getWeather(latitude, longitude) {
    // Open-Meteo 날씨 API 주소
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&timezone=auto`;

    // API에 요청 보내기
    const response = await fetch(url);

    // 요청이 정상적으로 처리되지 않았을 때
    if (!response.ok) {
        throw new Error("날씨 데이터를 가져오지 못했습니다.");
    }

    // 서버에서 받은 JSON 데이터를 JavaScript 객체로 변환
    const data = await response.json();

    // 현재 날씨와 단위 정보를 함께 반환
    return {
        current: data.current,
        units: data.current_units
    };
}