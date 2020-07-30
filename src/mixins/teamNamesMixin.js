export default {
  data () {
    return {
      teamLabels: {
        JAC: 'Jaguars',
        TEN: 'Titans',
        NYG: 'Giats',
        CHI: 'Bears',
        DET: 'Lions',
        GB: 'Packers',
        CAR: 'Panthers',
        TB: 'Buccaneers',
        BUF: 'Bills',
        MIA: 'Dolphins',
        SF: '49ers',
        NYJ: 'Jets',
        BAL: 'Ravens',
        HOU: 'Texans',
        CIN: 'Bengals',
        CLE: 'Browns',
        NO: 'Saints',
        LV: 'Raiders',
        LA: 'Rams',
        PHI: 'Eagles',
        NE: 'Patriots',
        SEA: 'Seahawks',
        ATL: 'Falcons',
        DAL: 'Cowboys',
        KC: 'Chiefs',
        LAC: 'Chargers',
        DEN: 'Broncos',
        PIT: 'Steelers',
        WAS: 'Redskins',
        ARI: 'Cardinals',
        MIN: 'Vikings',
        IND: 'Colts'
      }
    }
  },
  methods: {
    getTeamLabel (key) {
      return this.teamLabels[key]
    }
  }
}
