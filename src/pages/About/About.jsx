import styles from './About.module.css'

function About() {
  return (
    <div className={styles.about}>
      <div className={styles.hero}>
        <h1 className={styles.title}>О проекте CityPulse</h1>
        <p className={styles.subtitle}>
          Ваш путеводитель по городским событиям
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Кто мы</h2>
          <p>
            CityPulse — это современный агрегатор городских мероприятий, который помогает жителям 
            и гостям города находить интересные события: концерты, спортивные матчи, кинопремьеры, 
            выставки, театральные постановки и фестивали.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Наша миссия</h2>
          <p>
            Мы стремимся сделать культурную жизнь города доступнее и проще. Больше не нужно 
            искать события на десятках разных сайтов — всё в одном месте, удобно и быстро.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Что мы предлагаем</h2>
          <ul>
            <li>Актуальная информация о мероприятиях</li>
            <li>Удобный поиск и фильтрация по категориям</li>
            <li>Персональные рекомендации</li>
            <li>Избранное для сохранения интересных событий</li>
            <li>Карты с локациями мероприятий</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Свяжитесь с нами</h2>
          <p>
            Email: <a href="mailto:info@citypulse.ru">info@citypulse.ru</a><br/>
            Телефон: +7 (495) 123-45-67
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
