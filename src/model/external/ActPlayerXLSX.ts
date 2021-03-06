import {BaseXLSX} from "./BaseXLSX";
import {PlayerDoc, PlayerInfo} from "../PlayerInfo";
export class ActPlayerXLSX extends BaseXLSX {
    playerDoc:PlayerDoc;

    constructor(sheet, row) {
        super(sheet, row);
        if (!this.isEmpty) {
            this.playerDoc = new PlayerDoc();
            this.playerDoc.backNumber = this.col('A').v;
            this.playerDoc.name = this.col('B').v;
            // this.playerDoc.phone = this.col('C').v;
            // this.playerDoc.height = this.col('D').v;
            // PlayerInfo.setStyleFromStr(this.playerDoc, this.col('E').v);
            // this.playerDoc.size = this.col('F').v;
            // this.playerDoc.eloScore = 2000;
        }
    }

    toJson() {
        return JSON.parse(JSON.stringify(this.playerDoc));
    }
}