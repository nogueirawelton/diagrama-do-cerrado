import {
  ComponentProps,
  createContext,
  RefObject,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { FieldError } from "react-hook-form";
import { PiEye, PiEyeClosed } from "react-icons/pi";

type RootProps = ComponentProps<"div"> & {
  error?: FieldError;
};

type ControlProps = ComponentProps<"input">;
type PrefixProps = ComponentProps<"div">;
type ActionProps = ComponentProps<"div">;

type InputState = {
  visible: boolean;
};

type UpdateStateFunction = <K extends keyof InputState>(
  field: K,
  value: InputContextData["inputState"][K],
) => void;

type InputContextData = {
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  inputState: InputState;
  updateInputState: UpdateStateFunction;
};

const InputContext = createContext<InputContextData | null>(null);

function useInputContext() {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("Input.* components must be used within an Input.Root");
  }
  return context;
}

function Root({ error, children, ...props }: RootProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputState, setInputState] = useState<InputState>({
    visible: false,
  });

  const updateInputState: UpdateStateFunction = useCallback((field, value) => {
    setInputState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <InputContext
      value={{
        inputId,
        inputRef,
        inputState,
        updateInputState,
      }}
    >
      <div {...props}>
        <div className="h-12 border flex items-stretch border-zinc-300 rounded-md">
          {children}
        </div>

        {error && <small className="text-red-500">{error.message}</small>}
      </div>
    </InputContext>
  );
}

function Control({ type, ...props }: ControlProps) {
  const { inputId, inputRef, inputState } = useInputContext();

  const isPasswordType = type === "password";
  const shouldShowPassword = isPasswordType && inputState.visible;

  const resolvedType = shouldShowPassword ? "text" : type;

  return (
    <input
      id={inputId}
      ref={inputRef}
      type={resolvedType}
      className="flex-1 px-4 h-full outline-0"
      {...props}
    />
  );
}

function Prefix({ children }: PrefixProps) {
  return (
    <div className="grid pl-3 h-full place-items-center">
      {children}
    </div>
  );
}

function Action({ children }: ActionProps) {
  return <div className="h-full aspect-square">{children}</div>;
}

function PasswordAction() {
  const { inputState, updateInputState } = useInputContext();

  return (
    <button
      type="button"
      onClick={() => updateInputState("visible", !inputState.visible)}
      className="grid size-full cursor-pointer place-items-center"
    >
      {inputState.visible ? (
        <PiEyeClosed className="size-5 text-zinc-400" />
      ) : (
        <PiEye className="size-5 text-zinc-400" />
      )}
    </button>
  );
}

export const Input = {
  Root,
  Control,
  Prefix,
  Action,
  PasswordAction,
};
