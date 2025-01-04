import * as React from 'react';

enum StepStates {
  NOT_STARTED = 'not_started',
  CURRENT = 'current',
  ERROR = 'error',
  COMPLETED = 'completed',
}

interface ProgressStep {
  label: string;
  subtitle?: string;
  name: string;
  state?: StepStates;
  content: React.ReactNode;
  validator?: (payload?: any) => boolean;
}

interface StepProgressProps {
  steps: ProgressStep[];
  startingStep: number;
  wrapperClass?: string;
  progressClass?: string;
  stepClass?: string;
  labelClass?: string;
  subtitleClass?: string;
  contentClass?: string;
  buttonWrapperClass?: string;
  primaryBtnClass?: string;
  secondaryBtnClass?: string;
  submitBtnName?: string;
  onSubmit: Function;
  previousBtnName?: string;
  nextBtnName?: string;
}

interface ReducerAction {
  type: string;
  payload: { index: number; state: StepStates };
}

function stepsReducer(
  steps: ProgressStep[],
  action: ReducerAction
): ProgressStep[] {
  return steps.map(function (step, i) {
    if (i < action.payload.index) {
      step.state = StepStates.COMPLETED;
    } else if (i === action.payload.index) {
      step.state = action.payload.state;
    } else {
      step.state = StepStates.NOT_STARTED;
    }
    return step;
  });
}

function StepProgressBar(props: StepProgressProps): JSX.Element {
  const {
    steps,
    startingStep,
    wrapperClass,
    progressClass,
    stepClass,
    labelClass,
    subtitleClass,
    contentClass,
    buttonWrapperClass,
    primaryBtnClass,
    secondaryBtnClass,
    submitBtnName,
    onSubmit,
    previousBtnName,
    nextBtnName,
  } = props;
  const [state, dispatch] = React.useReducer(stepsReducer, steps);
  const [currentIndex, setCurrentIndex] = React.useState(startingStep);

  React.useEffect(function () {
    dispatch({
      type: 'init',
      payload: { index: currentIndex, state: StepStates.CURRENT },
    });
  }, []);

  function submitHandler(): void {
    onSubmit();
  }

  function nextHandler(): void {
    if (currentIndex === steps.length - 1) {
      return;
    }
    let isStateValid = true;
    const stepValidator = state[currentIndex].validator;

    if (stepValidator) {
      isStateValid = stepValidator();
    }
    dispatch({
      type: 'next',
      payload: {
        index: isStateValid ? currentIndex + 1 : currentIndex,
        state: isStateValid ? StepStates.CURRENT : StepStates.ERROR,
      },
    });

    if (isStateValid) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function prevHandler(): void {
    if (currentIndex === 0) {
      return;
    }

    dispatch({
      type: 'previous',
      payload: {
        index: currentIndex - 1,
        state: StepStates.CURRENT,
      },
    });
    setCurrentIndex(currentIndex - 1);
  }

  return (
    <div>
      <ul>
        {state.map(function (step, i) {
          return (
            <li key={i}>
              {step.state === StepStates.COMPLETED && (
                <span>
                  <svg
                    width='1.5rem'
                    viewBox='0 0 13 9'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 3.5L4.5 7.5L12 1'
                      stroke='white'
                      strokeWidth='1.5'
                    />
                  </svg>
                </span>
              )}
              {step.state === StepStates.ERROR && <span>!</span>}
              {step.state !== StepStates.COMPLETED &&
                step.state !== StepStates.ERROR && <span>{i + 1}</span>}
              <div>
                {step.label}
                {step.subtitle && <div>{step.subtitle}</div>}
              </div>
            </li>
          );
        })}
      </ul>

      <div>{props.steps[currentIndex].content}</div>

      <div>
        <a onClick={prevHandler}>
          {previousBtnName ? previousBtnName : 'Previous'}
        </a>
        {currentIndex === state.length - 1 ? (
          <a onClick={submitHandler}>{submitBtnName || 'Submit'}</a>
        ) : (
          <a onClick={nextHandler}>{nextBtnName ? nextBtnName : 'Next'}</a>
        )}
      </div>
    </div>
  );
}

export default StepProgressBar;
