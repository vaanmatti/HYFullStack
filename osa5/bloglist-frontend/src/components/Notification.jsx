const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const notificationClass = message.type === 'success' ? 'success' : 'error'
  return (
    <div className={notificationClass}>
      {message.text}
    </div>
  )
}

export default Notification