
import { Link } from 'react-router-dom'
import styles from "./BtnCreatePartie.module.css"
const BtnCreatePartie = () => {
  return (
    <Link className={styles.btn} to="/partie/new">
      Botão Criar Festa
    </Link>
  )
}

export default BtnCreatePartie