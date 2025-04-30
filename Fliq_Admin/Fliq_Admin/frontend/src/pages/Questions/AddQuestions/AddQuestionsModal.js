import styles from './AddQuestionsModal.module.scss';
import { useState} from "react";
import axiosInstance from "../../../services/axiosInstance";
import { uploadToS3 } from '../../../utils/s3Upload';

function AddQuestionsModal({onClose, subcategory,categoryId, imageUrl}) {
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [questions, setQuestions] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState({A:"", B:"", C:"", D:""});
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [hint, setHint] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hashtag, setHashtag] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    //const [imageUrl, setImageUrl] = useState("");

    //console.log("Image Url-", imageUrl);

    const handleQuestionChange = (e) => setQuestion(e.target.value);

    const handleOptionChange = (option, value) => {
        setOptions((prevOptions) => ({...prevOptions, [option]: value}));
    }

    const handleNext = () => {
        if (!question || !options.A || !options.B || !options.C || !options.D || !correctAnswer) {
            setError("All fields are required before adding a new question.");
            return;
        }
    
        const newQuestion = {
            question,
            options: [
                { id: "A", name: options.A },
                { id: "B", name: options.B },
                { id: "C", name: options.C },
                { id: "D", name: options.D }
            ],
            correctOption: { id: correctAnswer, name: options[correctAnswer] },
            hint,
            hashtags: [...hashtag]
        };
    
        let updatedQuestions = [...questions];
    
        if (currentIndex < questions.length) {
            updatedQuestions[currentIndex] = newQuestion;
        } else {
            updatedQuestions.push(newQuestion);
        }
    
        setQuestions(updatedQuestions); 
        const nextIndex = currentIndex + 1;

    if (nextIndex < updatedQuestions.length) {
        // Loading existing next question
        const nextQuestion = updatedQuestions[nextIndex];
        setQuestion(nextQuestion.question);
        setOptions({
            A: nextQuestion.options.find(opt => opt.id === "A")?.name || "",
            B: nextQuestion.options.find(opt => opt.id === "B")?.name || "",
            C: nextQuestion.options.find(opt => opt.id === "C")?.name || "",
            D: nextQuestion.options.find(opt => opt.id === "D")?.name || "",
        });
        setCorrectAnswer(nextQuestion.correctOption.id);
        setHashtag(Array.isArray(nextQuestion.hashtags)? nextQuestion.hashtags : []);
        setHint(nextQuestion.hint);
    } else {
        setQuestion("");
        setOptions({ A: "", B: "", C: "", D: "" });
        setCorrectAnswer("");
        setHashtag([]);
        setHint("");
    }

    setCurrentIndex(nextIndex);
    setError(null);
    };

    const handlePrevious = () => {
        if (currentIndex === 0) return;  
    
        const prevQuestion = questions[currentIndex - 1];
    
        setQuestion(prevQuestion.question);
        setOptions({
            A: prevQuestion.options.find(opt => opt.id === "A")?.name || "",
            B: prevQuestion.options.find(opt => opt.id === "B")?.name || "",
            C: prevQuestion.options.find(opt => opt.id === "C")?.name || "",
            D: prevQuestion.options.find(opt => opt.id === "D")?.name || "",
        });
        setCorrectAnswer(prevQuestion.correctOption.id);
        setHashtag(Array.isArray(prevQuestion.hashtags) ? prevQuestion.hashtags : []);
        setHint(prevQuestion.hint);
        setCurrentIndex(currentIndex - 1);  
    };

    const handleSubmit = async () => {
        console.log("Questions before submitting:", questions);
    
        if (!question || !options.A || !options.B || !options.C || !options.D || !correctAnswer) {
            setError("All fields are required before submitting.");
            return;
        }
    
        setLoading(true);
        setError(null);
    
        let updatedQuestions = [...questions];
    
        const newQuestion = {
            question,
            options: [
                { id: "A", name: options.A },
                { id: "B", name: options.B },
                { id: "C", name: options.C },
                { id: "D", name: options.D }
            ],
            correctOption: { id: correctAnswer, name: options[correctAnswer] },
            hashtags: hashtag,
            hint
        };
    
        if (currentIndex < questions.length) {
            updatedQuestions[currentIndex] = newQuestion;
        } else {
            updatedQuestions.push(newQuestion);
        }
    
        console.log("Final Questions before API call:", updatedQuestions);
    
        try {
            let subCatId = subCategoryId;
    
            if (!subCatId) {

                // let uploadedImageUrl = "";
                // if (imageFile) {
                //     try {
                //         console.log("Uploading to S3:", imageFile);
                //         uploadedImageUrl = await uploadToS3(imageFile); // Upload to S3 and get URL
                //         console.log("Uploaded Image URL:", uploadedImageUrl);
                //         setImageUrl(uploadedImageUrl); 
                //     } catch (error) {
                //         console.error("Image upload failed:", error);
                //         alert("Image upload failed");
                //         return;
                //     }
                // }
        
                // const formData = new FormData();
                // formData.append("category", categoryId);
                // formData.append("title", subcategory);
                
                // if (imageUrl instanceof File) {
                //     formData.append("imageFile", imageUrl);
                // } else {
                //     console.error("Invalid image file:", imageUrl);
                //     setError("Invalid image file. Please upload again.");
                //     setLoading(false);
                //     return;
                // }
    
                const subcategoryResponse = await axiosInstance.post("/subcategories/create", {
                    // headers: { "Content-Type": "multipart/form-data" }
                    category: categoryId,
                    title: subcategory,
                    imageUrl: imageUrl,
                });
    
                if (subcategoryResponse.data.subcategory && subcategoryResponse.data.subcategory._id) {
                    subCatId = subcategoryResponse.data.subcategory._id;
                    setSubCategoryId(subCatId);
                } else {
                    console.error("Invalid response structure:", subcategoryResponse.data);
                    setError("Failed to save subcategory.");
                    setLoading(false);
                    return;
                }
            }
    
            const quizData = {
                subcategory: subCatId,
                category: categoryId,
                questions: updatedQuestions.map(q => ({
                    ...q,
                    hashtags: Array.isArray(q.hashtags) ? q.hashtags : [], 
                })),
            };
    
            const response = await axiosInstance.post("/quizzes/create", quizData);
            console.log("Question added successfully", response.data);
            alert("Quiz added successfully");
            resetForm();
        } catch (error) {
            console.error("Error adding Quiz: ", error);
            setError("Failed to save the quiz. Please try again.");
        }
    
        setLoading(false);
    };
    

    const resetForm = () => {
            setQuestions([]);
            setCurrentIndex(0);
            setQuestion("");
            setOptions({ A: "", B: "", C: "", D: "" });
            setCorrectAnswer("");
            setHint("");
            onClose();
    }
    

    return(
        <div className={styles.quizModalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.quizModalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>Inserting Quiz module</h2>
        
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.QuesNumber}>Question {currentIndex+1}</p>
                <label>Question Title</label>
                <div className={styles.inputContainer}>
                    <input type='text' placeholder='Enter Question' value={question} onChange={handleQuestionChange}/>
                </div>
        
                <div className={styles.optionsContainer}>
                    <div className={styles.optionBox}>
                        <label>Option A</label>
                        <input type='text' placeholder='Enter Option A' value={options.A} onChange={(e) => handleOptionChange("A", e.target.value)}></input>
                    </div>
                    <div className={styles.optionBox}>
                        <label>Option B</label>
                        <input type='text' placeholder='Enter Option B' value={options.B} onChange={(e) => handleOptionChange("B",e.target.value)}></input>
                    </div>
                </div>
                
                <div className={styles.optionsContainer}>
                    <div className={styles.optionBox}>
                        <label>Option C</label>
                        <input type='text' placeholder='Enter Option C' value={options.C} onChange={(e) => handleOptionChange("C", e.target.value)}></input>
                    </div>
                    <div className={styles.optionBox}>
                        <label>Option D</label>
                        <input type='text' placeholder='Enter Option D' value={options.D} onChange={(e) => handleOptionChange("D", e.target.value)}></input>
                    </div>
                </div>

                <div className={styles.customDropdown}>
                    <label>Correct Answer</label>
                    <select  value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
                        <option value="">Select Correct Answer</option>
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                    </select>
                </div>
                <br />

                <div className={styles.textarea}>
                    <label>HashTags</label>
                    <textarea 
                        placeholder="Enter hashtags separated by commas"
                        className={styles.textareaField} 
                        value={hashtag.join(", ")}
                        onChange={(e) => setHashtag(e.target.value.split(",").map(tag => tag.trim()))} 
                    />
                </div>

                <div className={styles.textarea}>
                    <label>Hint</label>
                    <textarea 
                        placeholder="Your text here"
                        className={styles.textareaField} 
                        value={hint}
                        onChange={(e) => setHint(e.target.value)}  
                    />
                </div>
        
                <div className={styles.modalActions}>

                    {currentIndex>0 && (            
                        <button className={styles.prev} onClick={handlePrevious}>Prev ({currentIndex})</button>
                    )}

                    <button className={styles.submitButton} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Uploading..." : "Upload Quiz"}
                    </button>
        
                    <button className={styles.next} onClick={handleNext}>Next ({currentIndex+2})</button>
                </div>
            </div>
        </div>
    )
}

export default AddQuestionsModal;