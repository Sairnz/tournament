import { useState } from 'react'
import './App.css'

function App() {
  const [isAdmin, setIsAdmin] = useState(true)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  // Initialize 2 teams with 5 players each
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Team 1',
      wins: 0,
      players: Array(5).fill().map((_, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        kills: 0,
        deaths: 0,
        assists: 0
      }))
    },
    {
      id: 2,
      name: 'Team 2',
      wins: 0,
      players: Array(5).fill().map((_, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        kills: 0,
        deaths: 0,
        assists: 0
      }))
    }
  ])

  const [selectedTeam, setSelectedTeam] = useState(0)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamWins, setNewTeamWins] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(0)
  const [playerStats, setPlayerStats] = useState({ kills: '', deaths: '', assists: '' })
  const [matchResults, setMatchResults] = useState({
    finals: { team1: 0, team2: 1, winner: null }
  })

  const ADMIN_PASSWORD = 'admin123'

  const updateTeamName = () => {
    if (newTeamName.trim() && selectedTeam >= 0) {
      const updatedTeams = [...teams]
      updatedTeams[selectedTeam].name = newTeamName
      setTeams(updatedTeams)
      setNewTeamName('')
    }
  }

  const updateTeamWins = () => {
    if (selectedTeam >= 0) {
      const updatedTeams = [...teams]
      updatedTeams[selectedTeam].wins = parseInt(newTeamWins, 10) || 0
      setTeams(updatedTeams)
      setNewTeamWins('')
    }
  }

  const updatePlayerName = () => {
    if (newPlayerName.trim() && selectedTeam >= 0 && selectedPlayer >= 0) {
      const updatedTeams = [...teams]
      updatedTeams[selectedTeam].players[selectedPlayer].name = newPlayerName
      setTeams(updatedTeams)
      setNewPlayerName('')
    }
  }

  const updatePlayerStats = () => {
    if (selectedTeam >= 0 && selectedPlayer >= 0) {
      const updatedTeams = [...teams]
      const player = updatedTeams[selectedTeam].players[selectedPlayer]
      player.kills = parseInt(playerStats.kills) || 0
      player.deaths = parseInt(playerStats.deaths) || 0
      player.assists = parseInt(playerStats.assists) || 0
      setTeams(updatedTeams)
      setPlayerStats({ kills: '', deaths: '', assists: '' })
    }
  }

  const updateMatchResult = (round, matchIndex, winnerIndex) => {
    const updatedResults = { ...matchResults }
    if (round === 'finals') {
      updatedResults.finals.winner = winnerIndex
    }
    setMatchResults(updatedResults)
  }

  const resetTournament = () => {
    setTeams(teams.map(team => ({
      ...team,
      wins: 0,
      players: team.players.map(player => ({
        ...player,
        kills: 0,
        deaths: 0,
        assists: 0
      }))
    })))
    setMatchResults({
      finals: { team1: 0, team2: 1, winner: null }
    })
  }

  const handleSwitchMode = () => {
    if (!isAdmin) {
      setShowPasswordInput(true)
    } else {
      setIsAdmin(false)
      setIsAuthenticated(false)
    }
  }

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setIsAuthenticated(true)
      setAdminPassword('')
      setShowPasswordInput(false)
    } else {
      alert('Incorrect password!')
      setAdminPassword('')
    }
  }

  const TeamCard = ({ team, index }) => {
    const totalKills = team.players.reduce((sum, player) => sum + player.kills, 0)

    return (
      <div className="team-card">
        <div className="team-header">
          <div>
            <h3>{team.name}</h3>
            <div className="team-subtitle">Total Kills: {totalKills}</div>
          </div>
          <span className="wins-badge">Wins: {team.wins}</span>
        </div>
        <div className="players-list">
          {team.players.map((player, playerIndex) => (
            <div key={player.id} className="player-row">
              <span className="player-name">{player.name}</span>
              <div className="kda-stats">
                <span className="stat">{player.kills}</span>
                <span className="stat-slash">/</span>
                <span className="stat">{player.deaths}</span>
                <span className="stat-slash">/</span>
                <span className="stat">{player.assists}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const MatchCard = ({ match, round, matchIndex, title }) => {
    const team1 = teams[match.team1]
    const team2 = teams[match.team2]
    const winner = match.winner !== null ? teams[match.winner] : null

    return (
      <div className="match">
        <div className="match-title">{title}</div>
        <div className="match-teams">
          <div className={`match-team ${winner && winner.id === team1?.id ? 'winner' : ''}`}>
            <span className="team-name">{team1 ? team1.name : 'TBD'}</span>
          </div>
          <div className="vs-text">VS</div>
          <div className={`match-team ${winner && winner.id === team2?.id ? 'winner' : ''}`}>
            <span className="team-name">{team2 ? team2.name : 'TBD'}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mode-switcher">
        <button
          className={`mode-btn ${isAdmin ? 'active' : ''}`}
          onClick={() => setIsAdmin(true)}
          disabled={!isAdmin && !isAuthenticated}
        >
          Admin Panel
        </button>
        <button
          className={`mode-btn ${!isAdmin ? 'active' : ''}`}
          onClick={() => setIsAdmin(false)}
        >
          Audience View
        </button>
      </div>

      {isAdmin && (
        <div className="header">
          <h1>⚔️ League of Legends Tournament - ADMIN</h1>
          <p>2-Team Championship Bracket - Admin Control Panel</p>
        </div>
      )}

      {!isAdmin && (
        <div className="header">
          <h1>⚔️ League of Legends Tournament</h1>
          <p>2-Team Championship Bracket</p>
        </div>
      )}

      <div className="tournament-content">
        <div className="teams-section">
          <h2>Teams & Players</h2>
          <div className="teams-grid">
            {teams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
          </div>
        </div>

        <div className="bracket-section">
          <h2>Tournament Bracket</h2>
          <div className="bracket-container">
            <div className="round">
              <div className="round-title">Finals</div>
              <MatchCard
                match={matchResults.finals}
                round="finals"
                matchIndex={0}
                title="Championship Match"
              />
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-controls">
            <div className="control-section">
              <h3>Edit Team Names</h3>
              <select value={selectedTeam} onChange={(e) => setSelectedTeam(parseInt(e.target.value))}>
                {teams.map((team, index) => (
                  <option key={team.id} value={index}>{team.name}</option>
                ))}
              </select>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="New team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <button onClick={updateTeamName}>Update Team</button>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  placeholder="Team wins"
                  value={newTeamWins}
                  onChange={(e) => setNewTeamWins(e.target.value)}
                />
                <button onClick={updateTeamWins}>Update Wins</button>
              </div>
            </div>

            <div className="control-section">
              <h3>Edit Player Stats</h3>
              <div className="player-controls">
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(parseInt(e.target.value))}>
                  {teams.map((team, index) => (
                    <option key={team.id} value={index}>{team.name}</option>
                  ))}
                </select>
                <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(parseInt(e.target.value))}>
                  {teams[selectedTeam]?.players.map((player, index) => (
                    <option key={player.id} value={index}>{player.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Player name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <button onClick={updatePlayerName}>Update Name</button>
              </div>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Kills"
                  value={playerStats.kills}
                  onChange={(e) => setPlayerStats({...playerStats, kills: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Deaths"
                  value={playerStats.deaths}
                  onChange={(e) => setPlayerStats({...playerStats, deaths: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Assists"
                  value={playerStats.assists}
                  onChange={(e) => setPlayerStats({...playerStats, assists: e.target.value})}
                />
                <button onClick={updatePlayerStats}>Update Stats</button>
              </div>
            </div>

            <button className="reset-btn" onClick={resetTournament}>Reset Tournament</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
