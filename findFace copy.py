import face_recognition
from PIL import Image

knownFacePath = "/Users/ZCY/Desktop/Face Recognition/testFace.jpg"
picture_of_me = face_recognition.load_image_file(knownFacePath)
my_face_encoding = face_recognition.face_encodings(picture_of_me)[0]

# my_face_encoding now contains a universal 'encoding' of my facial features that can be compared to any other picture of a face!

unknown_face_encoding = []

unknownFacePath1 = "/Users/ZCY/Desktop/Face Recognition/unknown1.jpg"
unknownFacePath2 = "/Users/ZCY/Desktop/Face Recognition/unknown2.jpg"
unknownFacePath3 = "/Users/ZCY/Desktop/Face Recognition/unknown3.jpg"

unknown_picture1 = face_recognition.load_image_file(unknownFacePath1)
unknown_picture2 = face_recognition.load_image_file(unknownFacePath2)
unknown_picture3 = face_recognition.load_image_file(unknownFacePath3)

unknown_face_encoding.append(face_recognition.face_encodings(unknown_picture1)[0])
unknown_face_encoding.append(face_recognition.face_encodings(unknown_picture2)[0])
unknown_face_encoding.append(face_recognition.face_encodings(unknown_picture3)[0])


#0.4 is the tolerence that I chose.
#first parameter must be a list of faceEncoding, second parameter must be one single encoding
results = face_recognition.compare_faces(unknown_face_encoding, my_face_encoding, 0.4)

for result in results:
    if result == True:
        print("It's a picture of me!")
    else:
        print("It's not a picture of me!")
        
