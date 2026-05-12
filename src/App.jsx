import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('landing')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const initialMatchTeams = [
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
  ]

  const [matchTeams, setMatchTeams] = useState({
    aram: initialMatchTeams,
    summonersRift: initialMatchTeams.map(team => ({
      ...team,
      players: team.players.map(player => ({ ...player }))
    }))
  })
  const [selectedMatch, setSelectedMatch] = useState('aram')
  const currentTeams = matchTeams[selectedMatch]

  const [selectedTeam, setSelectedTeam] = useState(0)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamWins, setNewTeamWins] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(0)
  const [playerStats, setPlayerStats] = useState({ kills: '', deaths: '', assists: '' })
  const [matchResults, setMatchResults] = useState({
    aram: { team1: 0, team2: 1, winner: null },
    summonersRift: { team1: 0, team2: 1, winner: null }
  })

  const ADMIN_PASSWORD = 'admin123'

  const updateTeamName = () => {
    if (newTeamName.trim() && selectedTeam >= 0) {
      const updatedMatchTeams = { ...matchTeams }
      const updatedTeams = [...updatedMatchTeams[selectedMatch]]
      updatedTeams[selectedTeam] = {
        ...updatedTeams[selectedTeam],
        name: newTeamName
      }
      updatedMatchTeams[selectedMatch] = updatedTeams
      setMatchTeams(updatedMatchTeams)
      setNewTeamName('')
    }
  }

  const updateTeamWins = () => {
    if (selectedTeam >= 0) {
      const updatedMatchTeams = { ...matchTeams }
      const updatedTeams = [...updatedMatchTeams[selectedMatch]]
      updatedTeams[selectedTeam] = {
        ...updatedTeams[selectedTeam],
        wins: parseInt(newTeamWins, 10) || 0
      }
      updatedMatchTeams[selectedMatch] = updatedTeams
      setMatchTeams(updatedMatchTeams)
      setNewTeamWins('')
    }
  }

  const updatePlayerName = () => {
    if (newPlayerName.trim() && selectedTeam >= 0 && selectedPlayer >= 0) {
      const updatedMatchTeams = { ...matchTeams }
      const updatedTeams = [...updatedMatchTeams[selectedMatch]]
      const updatedPlayers = [...updatedTeams[selectedTeam].players]
      updatedPlayers[selectedPlayer] = {
        ...updatedPlayers[selectedPlayer],
        name: newPlayerName
      }
      updatedTeams[selectedTeam] = {
        ...updatedTeams[selectedTeam],
        players: updatedPlayers
      }
      updatedMatchTeams[selectedMatch] = updatedTeams
      setMatchTeams(updatedMatchTeams)
      setNewPlayerName('')
    }
  }

  const updatePlayerStats = () => {
    if (selectedTeam >= 0 && selectedPlayer >= 0) {
      const updatedMatchTeams = { ...matchTeams }
      const updatedTeams = [...updatedMatchTeams[selectedMatch]]
      const updatedPlayers = [...updatedTeams[selectedTeam].players]
      updatedPlayers[selectedPlayer] = {
        ...updatedPlayers[selectedPlayer],
        kills: parseInt(playerStats.kills) || 0,
        deaths: parseInt(playerStats.deaths) || 0,
        assists: parseInt(playerStats.assists) || 0
      }
      updatedTeams[selectedTeam] = {
        ...updatedTeams[selectedTeam],
        players: updatedPlayers
      }
      updatedMatchTeams[selectedMatch] = updatedTeams
      setMatchTeams(updatedMatchTeams)
      setPlayerStats({ kills: '', deaths: '', assists: '' })
    }
  }

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    round: null,
    winnerIndex: null,
    teamName: ''
  })

  const updateMatchResult = (round, winnerIndex) => {
    const updatedResults = { ...matchResults }
    if (updatedResults[round]) {
      updatedResults[round] = {
        ...updatedResults[round],
        winner: winnerIndex
      }
    }
    setMatchResults(updatedResults)
    setConfirmModal({ open: false, round: null, winnerIndex: null, teamName: '' })
  }

  const openConfirmModal = (round, winnerIndex, teamName) => {
    setConfirmModal({ open: true, round, winnerIndex, teamName })
  }

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, round: null, winnerIndex: null, teamName: '' })
  }

  const resetTournament = () => {
    setMatchTeams({
      aram: initialMatchTeams,
      summonersRift: initialMatchTeams.map(team => ({
        ...team,
        players: team.players.map(player => ({ ...player }))
      }))
    })
    setMatchResults({
      aram: { team1: 0, team2: 1, winner: null },
      summonersRift: { team1: 0, team2: 1, winner: null }
    })
  }

  const handleChooseRules = () => {
    setMode('rules')
    setAdminPassword('')
  }

  const handleChooseAdmin = () => {
    setMode('admin-login')
    setAdminPassword('')
  }

  const handleChooseViewer = () => {
    setMode('viewer')
    setAdminPassword('')
  }

  const handleBackToSelection = () => {
    setMode('landing')
    setIsAdminAuthenticated(false)
    setAdminPassword('')
  }

  const handleLogout = () => {
    setIsAdminAuthenticated(false)
    setMode('landing')
    setAdminPassword('')
  }

  useEffect(() => {
    if (mode === 'admin' && !isAdminAuthenticated) {
      setMode('admin-login')
    }
  }, [mode, isAdminAuthenticated])

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      setMode('admin')
      setAdminPassword('')
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

  const MatchCard = ({ match, title, round, mode, onSelectWinner }) => {
    const currentMatchTeams = matchTeams[round] || []
    const team1 = currentMatchTeams[match.team1]
    const team2 = currentMatchTeams[match.team2]
    const winner = match.winner !== null ? currentMatchTeams[match.winner] : null

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
        <div className="match-actions">
          <button
            onClick={() => onSelectWinner(round, match.team1, team1?.name || 'Team 1')}
            disabled={mode !== 'admin'}
          >
            {team1 ? `${team1.name} Wins` : 'Team 1 Wins'}
          </button>
          <button
            onClick={() => onSelectWinner(round, match.team2, team2?.name || 'Team 2')}
            disabled={mode !== 'admin'}
          >
            {team2 ? `${team2.name} Wins` : 'Team 2 Wins'}
          </button>
        </div>
        <div className="match-winner">
          {winner ? `Winner: ${winner.name}` : 'Winner: TBD'}
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {mode === 'landing' && (
        <div className="landing-page">
          <div className="landing-card">
            <h1>Welcome to chillpinguuu's Mini Tournament</h1>
            <p>Choose to continue.</p>
            <div className="landing-actions">
              <button className="mode-btn" onClick={handleChooseRules}>Tournament Rules</button>
              <button className="mode-btn" onClick={handleChooseAdmin}>Admin Panel</button>
              <button className="mode-btn" onClick={handleChooseViewer}>Viewer Panel</button>
            </div>
          </div>
        </div>
      )}

      {mode === 'rules' && (
        <div className="landing-page">
          <div className="landing-card auth-card">
            <h1>Tournament Rules</h1>
            <p>
              Welcome to the tournament. Here are the main guidelines:
            </p>
            <ul className="rules-list">
              <li>Each team has 5 players.</li>
              <li>Wins and player stats are updated by admin only.</li>
              <li>Viewers can watch the bracket and team details but cannot edit anything.</li>
              <li>The final winner is decided by the admin selection.</li>
            </ul>
            <button className="secondary-btn" onClick={handleBackToSelection}>Back to selection</button>
          </div>
        </div>
      )}

      {mode === 'admin-login' && (
        <div className="landing-page">
          <div className="landing-card auth-card">
            <h1>Admin Login</h1>
            <p>Enter the password to access the admin panel.</p>
            <div className="input-group">
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button onClick={handleAdminLogin}>Login</button>
            </div>
            <button className="secondary-btn" onClick={handleBackToSelection}>Back to selection</button>
          </div>
        </div>
      )}

      {(mode === 'admin' || mode === 'viewer') && (
        <>
          <div className="header">
            <h1>{mode === 'admin' ? 'Admin Panel' : 'Audience Panel'}</h1>
            <p>
              {mode === 'admin'
                ? 'Manage teams, players, and match details.'
                : 'View teams, players, and the tournament bracket.'}
            </p>
            <div className="header-actions">
              <button
                className={`secondary-btn landing-return ${selectedMatch === 'aram' ? 'active' : ''}`}
                onClick={() => setSelectedMatch('aram')}
              >
                ARAM Match
              </button>
              <button
                className={`secondary-btn landing-return ${selectedMatch === 'summonersRift' ? 'active' : ''}`}
                onClick={() => setSelectedMatch('summonersRift')}
              >
                Summoner's Rift Match
              </button>
              <button className="secondary-btn landing-return" onClick={handleBackToSelection}>
                Exit
              </button>
              {mode === 'admin' && (
                <button className="secondary-btn landing-return" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>

          <div className="tournament-content">
            <div className="teams-section">
              <h2>{selectedMatch === 'aram' ? 'ARAM Teams & Players' : "Summoner's Rift Teams & Players"}</h2>
              <div className="teams-grid">
                {currentTeams.map((team, index) => (
                  <TeamCard key={team.id} team={team} index={index} />
                ))}
              </div>
            </div>

            <div className="bracket-section">
              <h2>{selectedMatch === 'aram' ? 'ARAM Bracket' : 'Summoner\'s Rift Bracket'}</h2>
              <div className="bracket-container">
                {selectedMatch === 'aram' && (
                          <MatchCard
                    match={matchResults.aram}
                    title="ARAM Match"
                    round="aram"
                    mode={mode}
                    onSelectWinner={openConfirmModal}
                  />
                )}
                {selectedMatch === 'summonersRift' && (
                  <MatchCard
                    match={matchResults.summonersRift}
                    title="Summoner's Rift Match"
                    round="summonersRift"
                    mode={mode}
                    onSelectWinner={openConfirmModal}
                  />
                )}
              </div>
            </div>

            {mode === 'admin' && (
              <div className="admin-controls">
                <div className="control-section">
                  <h3>Edit Team Names</h3>
                  <select value={selectedTeam} onChange={(e) => setSelectedTeam(parseInt(e.target.value))}>
                    {currentTeams.map((team, index) => (
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
                      {currentTeams.map((team, index) => (
                        <option key={team.id} value={index}>{team.name}</option>
                      ))}
                    </select>
                    <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(parseInt(e.target.value))}>
                      {currentTeams[selectedTeam]?.players.map((player, index) => (
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

          {confirmModal.open && (
            <div className="modal-overlay">
              <div className="confirm-modal">
                <div className="modal-header">
                  <h3>Confirm winner</h3>
                </div>
                <p>
                  Are you sure you want to set <strong>{confirmModal.teamName}</strong> as the winner for the <strong>{confirmModal.round === 'aram' ? 'ARAM' : "Summoner's Rift"}</strong> match?
                </p>
                <div className="modal-actions">
                  <button className="secondary-btn" onClick={closeConfirmModal}>Cancel</button>
                  <button
                    className="primary-btn"
                    onClick={() => updateMatchResult(confirmModal.round, confirmModal.winnerIndex)}
                  >
                    Confirm winner
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
