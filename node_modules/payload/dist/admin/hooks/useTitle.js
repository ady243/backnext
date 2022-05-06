import { useWatchForm } from '../components/forms/Form/context';
const useTitle = (useAsTitle) => {
    const { getField } = useWatchForm();
    const titleField = getField(useAsTitle);
    return titleField === null || titleField === void 0 ? void 0 : titleField.value;
};
export default useTitle;
