const regression = require("regression");

module.exports = {
    // Calculates a linear regression on a simple array
    calculateReg: data => regression.linear(data.map((v,i) => [i, v])).equation[0],
    // Calculates a trend towards a target on a dataset (positive is better, negative is worse)
    calculateTrend: (data, target) => -regression.linear(data.map((v,i) => [i, Math.abs(v - target)])).equation[0],
    // Describe textually a regression
    describeReg: (reg, threshold) => {
        const roundedReg = Math.round(reg);

        if (threshold !== undefined) {
            if(roundedReg >= threshold)
                return "strong up";
            else if(roundedReg <= -threshold)
                return "strong down";
        }
        if(roundedReg > 0)
            return "up";
        else if(roundedReg < 0)
            return "down";
        else return "stable";
    },
    // Describe a weather trend
    describeTrend: trend => {
        if(trend > 0)
            return "better";
        else if(trend < 0)
            return "worse";
        else return "stable";
    },
    convertToBeaufort: wind => Math.min(Math.floor(Math.pow(wind/0.836, 2/3)),12)
}