import { CancelActivityReqDto, RegisterActivityReqDto } from "@dtos/ActivityRegistrationDto";
import { ActivityRegistrationRepository } from "@repositories/ActivityRegistrationRepository";
import { ActivityRepository } from "@repositories/ActivityRepository";
import { UsersRepository } from "@repositories/UsersRepository";
import { AppError } from "@utils/AppError";

export class ActivityRegistrationService {

    // register activity 
    static async registerActivity(
        data: RegisterActivityReqDto
    ): Promise<string> {


        const user = await UsersRepository.findOneByOrFail({ id: data.userId });
        const activity = await ActivityRepository.findOneByOrFail({ id: data.activityId });
        if (activity.status === 'completed' || activity.status === 'cancelled') {
            throw new AppError('Cannot register for completed or cancelled activity', 400);
        }

        const existingRegistration = await ActivityRegistrationRepository.findOneBy({
            userId: user.id,
            activityId: activity.id
        });

        if (existingRegistration) {
            if (existingRegistration.status === 'cancelled') {
                existingRegistration.status = 'registered';
                existingRegistration.cancellationReason = null;
                existingRegistration.cancelledAt = null;
                existingRegistration.updatedAt = new Date();

                await ActivityRegistrationRepository.save(existingRegistration);
                return "success";
            }
            throw new AppError('User is already registered for this activity', 400);
        }

        const registration = ActivityRegistrationRepository.create({
            userId: user.id,
            activityId: activity.id,
            registeredAt: new Date(),
            status: 'registered'
        });

        const result = await ActivityRegistrationRepository.save(registration);

        return result ? "success" : "failed";
    }

    // cancel activity
    static async cancelActivity(
        data: CancelActivityReqDto
    ): Promise<string> {

        const activity = await ActivityRepository.findOneByOrFail({ id: data.activityId });
        if (activity.status === 'completed' || activity.status === 'cancelled') {
            throw new AppError('Cannot cancel completed or cancelled activity', 400);
        }

        const existingRegistration = await ActivityRegistrationRepository.findOneBy({
            activityId: activity.id
        });

        if (!existingRegistration) {
            throw new AppError('User is not registered for this activity', 400);
        }

        existingRegistration.status = 'cancelled';
        existingRegistration.cancellationReason = data.cancellationReason;
        existingRegistration.cancelledAt = new Date();
        existingRegistration.updatedAt = new Date();

        await ActivityRegistrationRepository.save(existingRegistration);

        return "success";
    }
}