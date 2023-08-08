import { useParams } from "react-router-dom";
import { useGet } from "../Utils/Fetch";

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  Navigation,
  Keyboard,
  Pagination,
} from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';

export default function Book() {
    const { id } = useParams()

    const { data: book } = useGet(`${process.env.REACT_APP_DEV_URL}/book_data/${id}`)

    SwiperCore.use([Navigation, Keyboard, Pagination]);

    return (
        <>
            {book && (
                <div className="book">
                    <Swiper
                        spaceBetween={25}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{
                          type: "fraction",
                        }}
                        keyboard
                        className="book-container"
                        >
                        {Array.from({ length: book.nbPages }, (_, index) => (
                            <SwiperSlide key={index}>
                                <img src={`${process.env.REACT_APP_DEV_URL}/bookUrl/${id}/${index}`} alt={`Page ${index}`} className="book-img" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </>
    )
}