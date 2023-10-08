import './TestNeedsResults.scss';
import { useEffect, useState } from 'react';
// import { Graphic } from './Graphic';
import Parser from 'html-react-parser';
import { PreGraphic } from './PreGraphic';
import { backgroundColors, borderColors, scales } from '../data/constants';
import { useCurrentWidth } from '../hooks/useCurrentWidth';

function getScores() {
  const scoresElement = document.querySelector('.results-digits p');
  return scoresElement ? scoresElement?.textContent?.split('-') : [];
}

const titles = scales.map((s) => s.info.title);
const names = scales.map((s) => s.info.name);

const TestNeedsResults = () => {
  // Properties
  const [scores, setScores] = useState([]);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const width = useCurrentWidth();
  const pyramidWidthMultiplier = width > 768 ? 2 : width > 500 ? 1.5 : 1;

  useEffect(() => {
    if (!document.body.classList.contains('gc-user-guest')) {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    const scores = getScores();
    setScores(scores)
  }, []);

  // Helper Functions

  const minLength = (value, num) => {
    return value.length >= num;
  };
  const maxLength = (value, num) => {
    return value.length <= num;
  };

  const isValidEmail = (value) => {
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return emailPattern.test(value);
  };

  const validateUserName = (value) => {
    const errors = [];
    if (!minLength(value, 3)) {
      errors.push({
        field: 'userName',
        errorText: 'Имя должны быть не менее 3 символов',
      });
    } else {
      if (!maxLength(value, 40)) {
        errors.push({
          field: 'userName',
          errorText: 'Имя должны быть не более 40 символов',
        });
      }
    }
    return errors;
  };

  const validateEmail = (value) => {
    const errors = [];
    if (!isValidEmail(value)) {
      errors.push({
        field: 'email',
        errorText: 'Введите корректный email',
      });
    }
    return errors;
  };

  const validateForm = () => {
    const errors = [...validateUserName(userName), ...validateEmail(email)];
    setErrors(errors);
    if (errors.length === 0) {
      setIsAuthorized(true);
      const form = document.querySelector('.form02');
      const inputs = form.querySelectorAll('input.f-input');
      inputs[0].value = inputs[0].value || userName;
      inputs[1].value = inputs[1].value || email;
      const btn = form.querySelector('button[type=submit]');
      btn.click();
    }
  };

  const changeUserName = (value) => {
    setUserName(value);
    if (isSubmitted) {
      setErrors([
        ...errors.filter((error) => error.field !== 'userName'),
        ...validateUserName(value),
      ]);
    }
  };

  const changeEmail = (value) => {
    setEmail(value);
    if (isSubmitted) {
      setErrors([...errors.filter((error) => error.field !== 'email'), ...validateEmail(value)]);
    }
  };

  const onUserInfoSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    validateForm();
  };

  return (
    <>
      {!!scores.length && (
        <div className={`quiz`}>
          <h1 className={'main'}>Тест на определение уровня удовлетворения потребностей</h1>
          <div className="final-results">
            {!isAuthorized ? (
              <>
                <h2>
                  Благодарим вас за прохождение теста на
                  <br />
                  определение уровня удовлетворения потребностей
                  <br />
                  от
                  <br /> <strong>Black Square University</strong>
                </h2>
                <form onSubmit={(e) => onUserInfoSubmit(e)} className="user-info">
                  <ul className="errors">
                    {errors
                      .filter((err) => err.field === 'userName')
                      .map((err, i) => (
                        <li key={i}>{err.errorText}</li>
                      ))}
                  </ul>
                  <input
                    name="userName"
                    placeholder={'Ваше имя'}
                    value={userName}
                    type="text"
                    onChange={(e) => changeUserName(e.target.value)}
                  />
                  <ul className="errors">
                    {errors
                      .filter((err) => err.field === 'email')
                      .map((err, i) => (
                        <li key={i}>{err.errorText}</li>
                      ))}
                  </ul>
                  <input
                    name="email"
                    value={email}
                    placeholder={'Ваш email'}
                    type="text"
                    onChange={(e) => changeEmail(e.target.value)}
                  />
                  <button type={'submit'} disabled={!(!isSubmitted || errors.length === 0)}>
                    К результатам теста
                  </button>
                </form>
              </>
            ) : (
              <>
                <PreGraphic scores={scores} titles={titles} />
                {/*<Graphic scores={scores} names={names} />*/}
                <h5>
                  <strong>Расшифровка диапазона</strong>
                </h5>
                <p>
                  <span style={{ color: '#2B7B76' }}>
                    <strong>До 9 баллов</strong>
                  </span>{' '}
                  &mdash;{' '}
                  <i>
                    низко выраженная потребность. В целом, эта потребность, скорее всего, закрыта
                    или на данном этапе вашей жизни пока не актуальна
                  </i>
                </p>
                <p>
                  <span style={{ color: '#906D2E' }}>
                    <strong>10-17 баллов</strong>
                  </span>{' '}
                  &mdash;{' '}
                  <i>
                    средне-выраженная потребность. В этой сфере есть проблемы, которые скорее всего,
                    их придется решать в скором времени
                  </i>
                </p>
                <p>
                  <span style={{ color: '#A642A2' }}>
                    <strong>18 - 25 баллов</strong>
                  </span>{' '}
                  &mdash;{' '}
                  <strong>
                    <i>ярко выраженная потребность.</i>
                  </strong>
                  <br />
                  <strong>Обратите внимание</strong> &mdash;{' '}
                  <i>
                    это та потребность и те вопросы, на которые вы сейчас реагируете острее всего,
                    возможно, даже неосознанно. Высокие баллы говорят о доминирующей потребности;
                    возможно, вы поставили себе цель из этой области; или столкнулись с
                    ограничивающими проблемами в этой области, которые вам необходимо решить, чтобы
                    двинуться дальше
                  </i>
                </p>

                <h5>
                  <strong>Расшифровка потребностей</strong>
                </h5>
                {scales.map((scale, index) => {
                  return (
                    <div
                      className="scale-info"
                      key={scale.id}
                      style={{
                        border: `2px dashed ${borderColors[index]}`,
                        backgroundColor: `${backgroundColors[index]}`,
                      }}
                    >
                      <p>
                        <strong>{index + 1}. </strong>
                        {scale.info.full ? Parser(scale.info.full) : ''}
                      </p>
                      {scale.info.note ? Parser(scale.info.note) : ''}
                    </div>
                  );
                })}
                <h5>
                  <strong>Заключительное слово о потребностях</strong>
                </h5>
                <p>
                  Пирамида потребностей &mdash; это не жесткая фигура, по которой, как нам всегда
                  казалось, нужно взбираться ступенька за ступенькой. Сам Маслоу писал о том, что
                  порядок в иерархии может меняться, в зависимости от жизненных обстоятельств, и
                  каждая из потребностей не обязательно должна быть утолена полностью — достаточно
                  частичного насыщения для перехода на следующую ступень.
                </p>
                <p>
                  «Я совершенно убеждён, что человек живёт хлебом единым только в условиях, когда
                  хлеба нет. Но что случается с человеческими стремлениями, когда хлеба вдоволь и
                  желудок всегда полон? Появляются более высокие потребности, и именно они, а не
                  физиологический голод, управляют нашим организмом. По мере удовлетворения одних
                  потребностей возникают другие, всё более и более высокие. Так постепенно, шаг за
                  шагом человек приходит к потребности в саморазвитии — наивысшей из них». А.Маслоу
                </p>
                <p>
                  Именно поэтому в научной системе координат нашего Института, мы исследуем
                  важнейший фактор, обеспечивающий спокойный возрастающий, а не компенсаторный
                  переход человека от одной потребности к другой — Адаптивный интеллект. Он
                  позволяет не просто идти вверх к своей высшей точке саморазвития, но и не “падать”
                  вниз из-за эмоциональных состояний, постоянно меняющихся и любых неблагоприятных
                  условий внешней среды. Адаптивный интеллект — важнейший фактор, это наша
                  психологическая иммунная система, которая обеспечивает удовлетворение наших
                  потребностей.
                </p>
                <h5>
                  <strong>Рекомендации для проработки</strong>
                </h5>
                <ul className={'pyramid-container'}>
                  {scales
                    .slice(0)
                    .reverse()
                    .map((scale, index) => (
                      <a href={`${scale.info.link}`} key={scale.id}>
                        <li
                          className={`pyramid-level pyramid-${index + 1}`}
                          style={{
                            width: `${
                              (!!index ? 105 + index * 30 : 41) * pyramidWidthMultiplier
                            }px`,
                          }}
                        >
                          <h6>{scale.info.course}</h6>
                          <div>{scale.info.name}</div>
                        </li>
                      </a>
                    ))}
                </ul>
                <p>
                  <strong>Результаты теста — перед вами, с чего начать работу?</strong>
                </p>
                <p>
                  У вашей доминирующей сейчас потребности — больше всего баллов. Таких может быть
                  несколько — определите, что для вас сейчас важнее всего.
                </p>
                <ul className={'not-italic'}>
                  Мы рекомендуем начать с одного из <strong>основных курсов</strong>:
                  <li>◼️ Школа Отношений,</li>
                  <li>◼️ Школа Коммуникаций,</li>
                  <li>◼️ Школа Умножения,</li>
                  <li>◼️ Школа Отношений,</li>
                  который позволит проработать Вашу доминирующую потребность.
                </ul>
                <p>
                  <strong>Базовые программы помогут</strong>:
                </p>
                <ul className={'not-italic'}>
                  <li>✅ Cнять напряжение и расчистить свой эмоциональный фон (Детокс 1.0)</li>
                  <li>
                    ✅ Освоить азы психологического здоровья и системного психологического знания
                    для жизни и любой проблемы (Black Square Club)
                  </li>
                  <li>
                    ✅ А Школа Адаптивного Интеллекта (AQ) и программа “Детокс 2.0 — Путь героя”
                    проработать адаптивный интеллект и механизм внедрения новых привычек, чтобы
                    изменения, которых вы так давно хотите, не заставили себя ждать❤️
                  </li>
                </ul>
              </>
            )}
          </div>
          )}
        </div>
      )}
    </>
  );
};

export default TestNeedsResults;
