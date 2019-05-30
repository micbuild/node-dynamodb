class Model {
  /**
   * @param {object} args
   * @param {object} args.logger
   * @param {object} args.config
   */
  constructor(args) {
    Object.assign(this, args);
  }

  _getRiskAndLevel (markerValue, normalRange) {
    let threshold = (normalRange[1] - normalRange[0]) / 10
    let markerRisk
    let groupLevel
    if (markerValue >= normalRange[0] && markerValue <= normalRange[1]) {
      markerRisk = 'Good'
    } else if (markerValue < normalRange[0] - threshold || markerValue > normalRange[1] + threshold) {
      markerRisk = 'Risk'
      if (markerValue < normalRange[0] - threshold) {
        groupLevel = 'low'
      } else {
        groupLevel = 'high'
      }
    } else {
      markerRisk = 'Attention'
      if (markerValue < normalRange[0]) {
        groupLevel = 'low'
      } else {
        groupLevel = 'high'
      }
    }
    return { risk: markerRisk, level: groupLevel }
  }

  async get(args) {
    const dbResults = await this.connectors.db.cbc.listCbc(args);
    if(!dbResults.length) return null;

    const [marker, prevMarker]  = dbResults.map(res => {
      return {
        WBC: res.wbcCount,
        RBC: res.rbcCount,
        HGB: res.hemoglobin,
        HCT: res.hematrocit,
        MCV: res.mcv,
        MCH: res.mch,
        MCHC: res.mchc,
        RDW: res.rdwCv,
        PLT: res.plateletCount,
        MPV: res.mpv
      }
    });

    let GoodPart = []
    let AttentionPart = []
    let RiskPart = []
    let UndefinedPart = []

    for(let markerName of Object.keys(marker)) {
      const [markerDefinitions] = await this.connectors.db.markers.list({ name: markerName });
      if(!markerDefinitions) continue;
      const normalRange = [markerDefinitions.range.male.min, markerDefinitions.range.male.max];
      const riskAndLevel = this._getRiskAndLevel(marker[markerName], normalRange);
      const markerRisk = riskAndLevel.risk
      let difference = null;
      if(prevMarker && prevMarker[markerName]) {
        let diff = marker[markerName] - prevMarker[markerName];
        difference = Math.round((diff / prevMarker[markerName]) * 1000) / 10;
      }
      const rowMarkerResult = {
        short_name: markerName,
        long_name: markerDefinitions.long_name,
        description: markerDefinitions.description,
        range_text: markerDefinitions.range_text.male,
        risk: markerRisk,
        difference,
        value: marker[markerName]
      };

      if (markerRisk === 'Risk') RiskPart.push(rowMarkerResult);
      else if (markerRisk === 'Attention') AttentionPart.push(rowMarkerResult);
      else if (markerRisk === 'Good') GoodPart.push(rowMarkerResult);
      else UndefinedPart.push(rowMarkerResult);
    }

    const results = [...RiskPart, ...AttentionPart, ...GoodPart, ...UndefinedPart];

    return results;
  };
}

module.exports = Model;
