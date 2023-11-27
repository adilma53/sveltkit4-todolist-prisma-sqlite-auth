// Import necessary modules
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Import your Prisma client
import { prisma } from '../../lib/server/prisma';

// Define user roles
const Roles = {
	ADMIN: 'ADMIN',
	USER: 'USER'
};

// Create a function to send a confirmation email
const sendConfirmationEmail = async (email) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'adil2mae@gmail.com', // Replace with your email
			pass: 'btxo htzr gqdw dryy ' // Replace with your email password
		}
	});

	const mailOptions = {
		from: 'adil2mae@gmail.com',
		to: email,
		subject: 'Confirmation',
		text: 'Thank you for signing up!'
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent ->', info.response);
	} catch (error) {
		console.error('Error sending email ->', error);
		// Handle email sending error if needed
	}
};

export const actions = {
	register: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username'); // Assuming 'username' is the email
		const password = data.get('password');

		console.log('typeof username -->', typeof username);
		console.log('typeof password -->', typeof password);

		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalidFormat: true });
		}

		const user = await prisma.user.findUnique({
			where: { username }
		});

		if (user) {
			return fail(400, { usernameTaken: true });
		}

		const newUser = await prisma.user.create({
			data: {
				username,
				passwordHash: await bcrypt.hash(password, 10),
				userAuthToken: crypto.randomUUID(),
				role: { connect: { name: Roles.USER } }
			}
		});

		// Send a confirmation email to the user
		await sendConfirmationEmail(username);

		throw redirect(303, '/');
	}
};
