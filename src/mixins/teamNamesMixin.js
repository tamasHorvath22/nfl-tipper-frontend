export default {
  data () {
    return {
      teamLabels: {
        JAC: 'Jaguars',
        TEN: 'Titans',
        NYG: 'Giants',
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
      },
      teams: [
        'JAC', 'TEN', 'NYG', 'CHI', 'DET', 'GB', 'CAR', 'TB', 'BUF', 'MIA', 'SF', 'NYJ',
        'BAL', 'HOU', 'CIN', 'CLE', 'NO', 'LV', 'LA', 'PHI', 'NE', 'SEA',
        'ATL', 'DAL', 'KC', 'LAC', 'DEN', 'PIT', 'WAS', 'ARI', 'MIN', 'IND'
      ]
    }
  },
  methods: {
    getTeamLabel (key) {
      return this.teamLabels[key]
    }
  }
}
