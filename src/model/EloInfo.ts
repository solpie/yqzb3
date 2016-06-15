export const EloConf = {
    score: 2000,
    K: 32
};
export class EloInfo {
    //
    static classicMethod(winEloScore, loseEloScore) {
        var Elo1 = winEloScore;

        var Elo2 = loseEloScore;

        var K = EloConf.K;

        var EloDifference = Elo2 - Elo1;

        var percentage = 1 / ( 1 + Math.pow(10, EloDifference / 400) );

        var win = Math.round(K * ( 1 - percentage ));
        return win;
    }
}