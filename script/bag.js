function showMyBag(){
    var myBag=[
        {name:"여권 ✈️", count: 1},
        {name:"스마트폰📱", count: 2},
        {name:"지갑", count:1}
    ];

    var resultText = "🎒 [내 가방 속 물품 목록]\n-----------------------\n";

    for (var i in myBag){
        resultText=resultText+"- "+myBag[i].name+" : "+myBag[i].count+"개\n";
    }

    resultText=resultText+"-----------------------\n";
    resultText=resultText+"총 물품 종류: "+myBag.length+"가지";

    alert(resultText);
}