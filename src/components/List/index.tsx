import './List.css'
interface ListProps {
  children?: React.ReactNode
}
const List = ({children}: ListProps) => {
  return (
    <div className='list'>
      {children}
    </div>
  )
}

export { List }