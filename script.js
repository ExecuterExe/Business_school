document.addEventListener('DOMContentLoaded', () => {
    const course = document.querySelector('.course');
    const courseHeader = course.querySelector('.course__header');
    const courseContent = course.querySelector('.course__content');
    const modules = document.querySelectorAll('.module');

    courseHeader.addEventListener('click', () => {
        course.classList.toggle('expanded');
    });

    modules.forEach(module => {
        const moduleTitle = module.querySelector('.module__title');
        const moduleLessons = module.querySelector('.module__lessons');

        moduleTitle.addEventListener('click', (event) => {
            event.stopPropagation();
            moduleLessons.style.display = moduleLessons.style.display === 'none' || moduleLessons.style.display === '' ? 'block' : 'none';
        });

        const lessons = module.querySelectorAll('.lesson');
        lessons.forEach(lesson => {
            const lessonTitle = lesson.querySelector('.lesson__title');
            const lessonTasks = lesson.querySelector('.lesson__tasks');

            lessonTitle.addEventListener('click', (event) => {
                event.stopPropagation();
                lessonTasks.style.display = lessonTasks.style.display === 'none' || lessonTasks.style.display === '' ? 'block' : 'none';
            });
        });
    });
});