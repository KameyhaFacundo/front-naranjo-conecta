import { Component } from 'react'
import Icon from './Icon.jsx'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary', error, info)
  }

  handleReintentar = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="estado-vacio-centrado estado-boundary">
        <span className="estado-vacio-icono estado-vacio-icono-error">
          <Icon name="alerta" size={26} />
        </span>
        <p>Algo salió mal. Probá de nuevo en un rato.</p>
        <div className="estado-boundary-acciones">
          <button type="button" onClick={this.handleReintentar}>
            Reintentar
          </button>
          <button type="button" className="btn-secundario" onClick={() => window.location.assign('/')}>
            Ir al inicio
          </button>
        </div>
      </div>
    )
  }
}
