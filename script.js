console.log("DNA Graphics website loaded successfully.");

const cards = document.querySelectorAll(".service-card");

cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = "0.8s ease";

        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, 300 + index * 150);

});
const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {

    quoteForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const phone =
            document.getElementById("phone").value;

        const email =
            document.getElementById("email").value;

        const service =
            document.getElementById("service").value;

        const quantity =
            document.getElementById("quantity").value;

        const size =
            document.getElementById("size").value;

        const deadline =
            document.getElementById("deadline").value;

        const finishing =
            document.getElementById("finishing").value;

        const message =
            document.getElementById("message").value;


        const whatsappMessage =
`Hello DNA Graphics 👋

I would like to request a quote.

Name: ${name}
Phone: ${phone}
Email: ${email}

Service: ${service}
Quantity: ${quantity}
Size: ${size}
Required Date: ${deadline}
Finishing: ${finishing}

Project Details:
${message}`;


        const whatsappNumber =
            "250780317239";


        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(whatsappMessage);


        window.open(
            whatsappURL,
            "_blank"
        );

    });

}
const menuToggle =
    document.getElementById("menuToggle");

const menuClose =
    document.getElementById("menuClose");

const mainNav =
    document.getElementById("mainNav");


if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.add("active");

        document.body.style.overflow = "hidden";

    });

}


if (menuClose && mainNav) {

    menuClose.addEventListener("click", () => {

        mainNav.classList.remove("active");

        document.body.style.overflow = "";

    });

}


if (mainNav) {

    const navLinks =
        mainNav.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");

            document.body.style.overflow = "";

        });

    });

}
/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});