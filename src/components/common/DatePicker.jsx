import Input from './Input';

/** Native date input wrapped in the shared field styling. Value is ISO "YYYY-MM-DD". */
export default function DatePicker(props) {
  return <Input type="date" {...props} />;
}
