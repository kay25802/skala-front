function showFortune(){
    const fortuens = [
        "🌞 오늘은 행운이 가득한 하루입니다!",

        "🍀 새로운 도전을 시작하기 좋은 날입니다.",

        "☕ 잠시 쉬어가면 더 좋은 결과가 생길 거예요.",

        "🎉 좋은 소식이 찾아올 가능성이 높습니다!",

        "💪 꾸준히 노력하면 원하는 목표에 가까워집니다.",

        "📚 오늘 공부운이 최고입니다!",

        "💖 소중한 사람과 즐거운 시간을 보내게 될 거예요.",

        "🌈 작은 행운이 큰 기쁨으로 이어집니다.",

        "✨ 자신감을 가지면 좋은 일이 생깁니다.",

        "😴 오늘은 충분한 휴식도 중요한 하루입니다."
    ];

    const randomIndex =
        Math.floor(Math.random()*fortuens.length);

    const todayFortune = fortuens[randomIndex];

    alert(`🔮 오늘의 운세\n\n${todayFortune}`);
}