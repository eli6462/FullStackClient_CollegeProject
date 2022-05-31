class Vehicle {
    // 6 properties for the father class (מחלקת אב)
    constructor(manufacturer,model,year,km,yadBealut,price){ //yadBealut = יד- בעלות
        this.manufacturer = manufacturer;
        this.model = model;
        this.year = year;
        this.km = km;
        this.yadBealut = yadBealut;
        this.price = price;
    }
    //calculates the age of the car
    calculateAge(){
        var currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }
    // שקלול מחירון
    weightedPrice(){
        var newPrice = this.price;        
        // שקלול לפי מספר שנים על הכביש - מינוס 5% על כל שנה
        for(var i = 0;i<this.calculateAge();i++)
            newPrice *= 0.95;  // המחירון יורד ב 5 אחוז כל שנה      
        // שקלול לפי ק"מ
        var kmSubPercent = (this.km /10000)* 0.5; // המחירון יורד ב 0.5 אחוז על כל 10,000 ק"מ
        newPrice = newPrice * (1-(0.01 * kmSubPercent)); // מכפילים את המחיר במשקולת שמשקללת (המשקולת משקפת את האחוז *הנותר* אחרי שקלול לפי ק"מ)        
        // שקלול לפי יד        
        for (var i = 0; i < this.yadBealut;i++)
            newPrice = newPrice * 0.95; // המחיר יורד ב 5 % על כל יד 

        return newPrice;
    }        
}

class Truck extends Vehicle{
    constructor(manufacturer,model,year,km,yadBealut,price,loadWeightKg,maxLoadWeightKg){
        super(manufacturer,model,year,km,yadBealut,price);        
        this.loadWeightKg = loadWeightKg; // משקל מטען המשאית
        this.maxLoadWeightKg = maxLoadWeightKg; //משקל *מותר* מקסימלי של מטען המשאית 
    }
    loadUp(additionalLoad){
        // -אם המשקל הנוכחי של המטען + המשקל שצריך להעמיס - גדול המשקל המקסימלי המותר של המטען
        // תעמיס רק עד למשקל המקסימלי שמותר
        if((this.loadWeightKg + additionalLoad) > this.maxLoadWeightKg)
            this.loadWeightKg = this.maxLoadWeightKg;
        // אחרת תעמיס מטען כרגיל
        else{
            this.loadWeightKg += additionalLoad;
        }
    }
    unLoad(minusLoad){
        // אם המשקל שצריך לפרוק יותר גדול ממשקל המטען הנוכחי - תפרוק עד למקסימום
        if ((this.loadWeightKg - minusLoad) < 0)
            this.loadWeightKg = 0;
        // אחרת תפרוק כרגיל
        else{
            this.loadWeightKg -= minusLoad;
        }
    }

    
}

class MotorCycle extends Vehicle{
    constructor(manufacturer,model,year,km,yadBealut,price,engineCapacityCc,tireSizeInch){
        super(manufacturer,model,year,km,yadBealut,price);
        this.engineCapacityCc = engineCapacityCc; // נפח מנוע בסמ"ק
        this.tireSizeInch = tireSizeInch; // גודל מציג באינץ
    }
    calculateLicenseClass(){
        if (this.engineCapacityCc <= 125)
            return 'A2';
        else if(this.engineCapacityCc <= 400)
            return 'A1';        
        else // אם נפח מנוע גדול מ- 400 סמ"ק (Cc)
            return 'A'
    }
    evaluateTireSize(){
        if (this.tireSizeInch < 15)
            return '(Small)'
        else if (this.tireSizeInch < 17)
            return '(Medium)'
        else // אם מידת הצמיגים היא 17 ומעלה
            return '(Large)'
    }
    
}

// קלאס רכב משפחתי = שתי משתנים נוספים: קיבולת מיכל דלק, כמות דלק בפועל במיכל
class PrivateCar extends Vehicle{
    constructor(manufacturer,model,year,km,yadBealut,price,maxFuelCapacity,currentFuelAmout){
        super(manufacturer,model,year,km,yadBealut,price);
        this.maxFuelCapacity = maxFuelCapacity; // קיבולת מקסימלית של מיכל דלק בליטרים
        this.currentFuelAmout = currentFuelAmout; // כמות דלק ברגע זה - בליטרים
    }
    //שתי פונקציות נוספות:
// פונקציה ראשונה: נסיעה - מקבלת פרמטר מרחק, מוסיפה את מרחק הנסיעה למאפיין של הק"מ, מורידה דלק ממד הדלק לפי 15 ק"מ לליטר 
drive(distanceKm){
    //תצרוכת הדלק היא 15 ק"מ לליטר - אם כמות הדלק שצריך לצרוך בליטרים, שהיא (מרחק ב ק"מ / 15)            
    // גדולה מכמות הדלק הנוכחית - סע רק עד כמה שכמות הדלק הונכחית תאפשר
    if (distanceKm/15 > this.currentFuelAmout){
        this.km += this.currentFuelAmout * 15;
        this.currentFuelAmout = 0;
    }
    // אחרת סע כרגיל את המרחק ב ק"מ שהתקבל בפרמטר בפונקציה
    else{
        this.km += distanceKm;
        this.currentFuelAmout -= distanceKm/15;
    }
}
// פונקציה שניה: תדלוק רכב, מוסיפה דלק לפי הפרמטר שהיא מקבלת, ולא יותר ממקסימום המיכל ( מאפיין קיבולת דלק)
refuel(fuelAmountLiters){
    // אם כמות הדלק שצריך לתדלק + כמות הדלק הנוכחית גדולים מקיבלות המיכל המקסימלית - תדלק רק עד למקסימום ולא יותר
    if (this.currentFuelAmout + fuelAmountLiters > this.maxFuelCapacity){
        this.currentFuelAmout = this.maxFuelCapacity;
    }
    // אחרת תדלק כרגיל
    else{
        this.currentFuelAmout += fuelAmountLiters;
    }
}
}

// ***display on screen***

// ***PrivateCar class***
var ibiza = new PrivateCar ("Seat","Ibiza",2020,120000,2,70000,42,35)
var toledo = new PrivateCar('Seat','Toledo',2022,0,0,100000,45,10)
// caliing class functions:
ibiza.drive(400);
toledo.refuel(30);
// vehicle class funtions: weightedPrice() is called in the *PRICE <P>*, and calculateAge() is called inside weightedPrice() function

// ibiza
//heding
document.getElementById("private1Company").innerHTML = ibiza.manufacturer;
document.getElementById("private1Model").innerHTML = ibiza.model;
// body
document.getElementById("private1Year").innerHTML += " " + ibiza.year;
document.getElementById("private1Km").innerHTML += " " + ibiza.km;
document.getElementById("private1Hand").innerHTML += " " + ibiza.yadBealut;
document.getElementById("private1Price").innerHTML += " " + parseInt(ibiza.weightedPrice());
document.getElementById("private1FuelCap").innerHTML += " " + parseInt(ibiza.maxFuelCapacity) + " Liters";
document.getElementById("private1FuelGage").innerHTML += " " + parseInt(ibiza.currentFuelAmout) + " Liters";

//toledo
//heding
document.getElementById("private2Company").innerHTML = toledo.manufacturer;
document.getElementById("private2Model").innerHTML = toledo.model;
// body
document.getElementById("private2Year").innerHTML += " " + toledo.year;
document.getElementById("private2Km").innerHTML += " " + toledo.km;
document.getElementById("private2Hand").innerHTML += " " + toledo.yadBealut;
document.getElementById("private2Price").innerHTML += " " + parseInt(toledo.weightedPrice());
document.getElementById("private2FuelCap").innerHTML += " " + toledo.maxFuelCapacity + " Liters";
document.getElementById("private2FuelGage").innerHTML += " " + toledo.currentFuelAmout + " Liters";



// ***truck class***

var mercedes = new Truck('Mercedes','Actros',2019,70000,3,200000,2000,5000);
var scania = new Truck('Scania','G-Series',2018,65000,1,180000,3000,8000);
// caliing class functions:
mercedes.loadUp(2000);
scania.unLoad(1500)
// vehicle class funtions: weightedPrice() is called in the *PRICE <P>*, and calculateAge() is called inside weightedPrice() function

//mercedes
//heding
document.getElementById("truck1Company").innerHTML = mercedes.manufacturer;
document.getElementById("truck1Model").innerHTML = mercedes.model;
// body
document.getElementById("truck1Year").innerHTML += " " + mercedes.year;
document.getElementById("truck1Km").innerHTML += " " + mercedes.km;
document.getElementById("truck1Hand").innerHTML += " " + mercedes.yadBealut;
document.getElementById("truck1Price").innerHTML += " " + parseInt(mercedes.weightedPrice());
document.getElementById("truck1MaxLoad").innerHTML += " " + mercedes.maxLoadWeightKg + " Kg";
document.getElementById("truck1CurrentLoad").innerHTML += " " + mercedes.loadWeightKg + " Kg";

//scania
//heding
document.getElementById("truck2Company").innerHTML = scania.manufacturer;
document.getElementById("truck2Model").innerHTML = scania.model;
// body
document.getElementById("truck2Year").innerHTML += " " + scania.year;
document.getElementById("truck2Km").innerHTML += " " + scania.km;
document.getElementById("truck2Hand").innerHTML += " " + scania.yadBealut;
document.getElementById("truck2Price").innerHTML += " " + parseInt(scania.weightedPrice());
document.getElementById("truck2MaxLoad").innerHTML += " " + scania.maxLoadWeightKg + " Kg";
document.getElementById("truck2CurrentLoad").innerHTML += " " + scania.loadWeightKg + " Kg";



// motorCycle class

var bmw = new MotorCycle('Bmw','R1250',2021,10000,2,150000,425,17)
var kawasaki = new MotorCycle('Kawasaki','Ninja 400',2017,80000,1,170000,500,18)
// caliing class functions:
// calculateLicenseClass() is called in the *LICENSE <P>* 
// evaluateTireSize() is called in the *TIRES <P>*
// vehicle class funtions: weightedPrice() is called in the *PRICE <P>*, and calculateAge() is called inside weightedPrice() function

//bmw
//heding
document.getElementById("motorCycle1Company").innerHTML = bmw.manufacturer;
document.getElementById("motorCycle1Model").innerHTML = bmw.model;
// body
document.getElementById("motorCycle1Year").innerHTML += " " + bmw.year;
document.getElementById("motorCycle1Km").innerHTML += " " + bmw.km;
document.getElementById("motorCycle1Hand").innerHTML += " " + bmw.yadBealut;
document.getElementById("motorCycle1Price").innerHTML += " " + parseInt(bmw.weightedPrice());
document.getElementById("motorCycle1Engine").innerHTML += " " + bmw.engineCapacityCc + " Cc";
document.getElementById("motorCycle1License").innerHTML += " " + bmw.calculateLicenseClass();
document.getElementById("motorCycle1Tires").innerHTML += " " + bmw.tireSizeInch + " Inch " + bmw.evaluateTireSize();

//kawasaki
//heding
document.getElementById("motorCycle2Company").innerHTML = kawasaki.manufacturer;
document.getElementById("motorCycle2Model").innerHTML = kawasaki.model;
// body
document.getElementById("motorCycle2Year").innerHTML += " " + kawasaki.year;
document.getElementById("motorCycle2Km").innerHTML += " " + kawasaki.km;
document.getElementById("motorCycle2Hand").innerHTML += " " + kawasaki.yadBealut;
document.getElementById("motorCycle2Price").innerHTML += " " + parseInt(kawasaki.weightedPrice());
document.getElementById("motorCycle2Engine").innerHTML += " " + kawasaki.engineCapacityCc + " Cc";
document.getElementById("motorCycle2License").innerHTML += " " + kawasaki.calculateLicenseClass();
document.getElementById("motorCycle2Tires").innerHTML += " " + kawasaki.tireSizeInch + " Inch " + kawasaki.evaluateTireSize();


